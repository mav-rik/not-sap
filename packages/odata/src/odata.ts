import {
  extractGenericErrorMessage,
  ifetch,
  IFetchError,
  isSapODataError,
  SapODataError,
} from './ifetch'
import { Metadata } from './metadata/metadata'
import { odataValueFormat } from './metadata/format-edm'
import { buildODataParams, chunkArray, debounce } from './utils'
import { EntitySet } from './metadata'

interface T__Metadata {
  id: string
  type: string
  uri: string
}

export interface TODataOptions {
  path?: string
  headers?: Record<string, string>
  host?: string
  csrfTtl?: number
  useBatch?: boolean
  handleCsrf?: boolean
}

export interface TOdataBatchRequestItem {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
  asChangeset?: boolean
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

const ODATA_PATH = '/sap/opu/odata/sap/'

export interface TOdataDummyInterface {
  entitySets: Record<
    string,
    string
  >
  entityTypes: Record<
    string,
    {
      keys: string
      fields: string
      measures: string
      navToMany: Record<string, string>
      navToOne: Record<string, string>
      record: Record<string, unknown>
      actions: string
      functions: string
    }
  >
  functions: Record<
    string,
    {
      params: Record<string, any> | never
      returnType: any
    }
  >
  actions: Record<
    string,
    {
      params: Record<string, any> | never
      returnType: any
    }
  >
  complexTypes: Record<string, Record<string, any>>
}

export type TWrapODataRecord<T = Record<string, unknown>> = {
  // v2
  'd'?: TOdataRecord<T>
  // v4
  '@odata.context'?: string
  '@odata.metadataEtag'?: string
} & T

export type TWrapODataResults<T = Record<string, unknown>> = {
  // v2
  'd'?: {
    __count?: string
    results?: TOdataRecord<T>[]
  }
  // v4
  '@odata.context'?: string
  '@odata.metadataEtag'?: string
  '@odata.count'?: number
  'value'?: TOdataRecord<T>[]
}
export type TOdataRecord<T = Record<string, unknown>> = T & {
  '@odata.context'?: string
  '@odata.metadataEtag'?: string
  '__metadata'?: T__Metadata
  // row styles
  '__rowClass': string
}
export type TOdataReadResult<T = Record<string, unknown>> = {
  data: TOdataRecord<T>[]
  count?: number
}

export interface TODataParams {
  '$top'?: number
  '$skip'?: number
  '$filter'?: string
  '$select'?: string
  '$orderby'?: string
  '$expand'?: string
  'search-focus'?: string
  'search'?: string // v2 search
  '$search'?: string // v4 search
  '$inlinecount'?: 'allpages'
  '$count'?: 'true'
  '$apply'?: string // v4 apply
  '$format'?: 'json' | 'xml' | 'xlsx'
}

/**
 * Class representing an OData service.
 *
 * @template M - The interface representing the OData model.
 */
export class OData<M extends TOdataDummyInterface = TOdataDummyInterface> {
  constructor(
    public readonly service: string,
    public readonly options: TODataOptions = {}
  ) {}

  public get url() {
    return this.options.path || `${ODATA_PATH}${this.service}`
  }
  public get host() {
    return this.options.host || ''
  }

  public genRequestUrl(entity: string, params?: TODataParams) {
    return `${this.host}${this.url}/${entity}${buildODataParams(params)}`
  }

  public async _fetch<T>(
    url: string,
    options: {
      method: string
      headers?: Record<string, string>
      body?: string
    },
    expectedFormat: 'json' | 'xml' | 'xlsx' | 'multipart' | 'text',
    disableBatch?: boolean
  ): Promise<T> {
    if (disableBatch || !this.options.useBatch) {
      try {
        if (options.method && options.method !== 'GET') {
          options.headers = {
            ...(this.options.handleCsrf ? {
              'x-csrf-token': await this.getCSRF(),
            } : {}),
            ...options.headers,
          }
        }
        const response = await ifetch<T>(url, options)

        // Define expected content types for each format
        const formatContentTypes: Record<'json' | 'xml' | 'xlsx' | 'multipart' | 'text', string[]> =
          {
            json: ['application/json'],
            xml: ['application/xml', 'text/xml'],
            xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            multipart: ['multipart/mixed'],
            text: ['text/plain'],
          }

        const expectedTypes = formatContentTypes[expectedFormat]
        const contentType = response.headers.get('content-type') || ''

        if (response.status !== 204) {
          // Validate content type using the mapping to reduce repetition
          const isValidFormat = expectedTypes.some(type => contentType.includes(type))

          if (!isValidFormat) {
            if (typeof response.body === 'string' && response.body.includes('okta.com/app/')) {
              throw new IFetchError('Unauthorized error', 401, 'Unauthorized')
            }
            throw new IFetchError(
              `Unexpected response format (expected ${expectedFormat.toUpperCase()})`,
              response.status,
              response.statusText
            )
          }

          // Additional check for unauthorized access in the response body
          if (typeof response.body === 'string' && response.body.includes('okta.com/app/')) {
            throw new IFetchError('Unauthorized error', 401, 'Unauthorized')
          }
        }

        return response.body
      } catch (error) {
        if (error instanceof IFetchError || error instanceof SapODataError) {
          throw error
        }

        // For unexpected errors, wrap them in IFetchError
        throw new IFetchError((error as Error).message || 'Unknown Error', 0, 'Unknown Error')
      }
    } else {
      this._executeBatchDebounced()
      return this._addRequestToBatch<T>(url, options)
    }
  }

  /**
   * Reads data from the specified OData entity set.
   *
   * @template T - The key of the entity set in the OData model.
   * @param {T} entity - The entity set to read from.
   * @param {TODataParams} [params] - Optional parameters for the OData query.
   * @throws {Error} - Throws an error if the OData request fails.
   */
  async read<T extends keyof M['entitySets']>(
    entity: T,
    params?: TODataParams
  ): Promise<TOdataReadResult<M['entityTypes'][M['entitySets'][T]]['record']>> {
    const data = await this._fetch<TWrapODataResults<M['entityTypes'][M['entitySets'][T]]['record']>>(
      this.genRequestUrl(entity as string, params),
      {
        method: 'GET',
        headers: {
          ...this.options.headers,
          accept: 'application/json',
        },
      },
      'json'
    )
    return {
      data: (data.value ? data.value : data.d?.results) || [],
      count: Number(data.d?.__count || data['@odata.count'] || 0),
    }
  }

  async readCount<T extends keyof M['entitySets']>(entity: T, params?: TODataParams) {
    const data = await this._fetch(
      this.genRequestUrl((entity as string) + '/$count', {
        $filter: params?.['$filter'],
      }),
      {
        method: 'GET',
        headers: {
          ...this.options.headers,
        },
      },
      'text'
    )
    return Number(data)
  }

  /**
   * Reads all entries from a specified OData entity set in chunks, optionally reporting progress.
   *
   * @template T - The key of the entity set in the OData model.
   * @param {T} entity - The entity set to read from.
   * @param {TODataParams & { chunkSize?: number, progressCb?: (count: number, total?: number, done?: boolean) => void }} [params] - Optional parameters for the OData query, including chunk size and a progress callback.
   * @returns {Promise<{ abort: () => void, promise: Promise<TOdataRecord<M['entityTypes'][M['entitySets'][T]]['fields']>> }>} - An object containing a method to abort the operation and a promise that resolves to the array of data records.
   * @throws {Error} - Throws an error if the OData request fails.
   */
  readAllEntries<T extends keyof M['entitySets']>(
    entity: T,
    params?: TODataParams & {
      chunkSize?: number
      progressCb?: (count: number, total?: number, done?: boolean) => void
    }
  ) {
    const batch = this.createBatch()
    const chunkSize = params?.chunkSize || 100

    let abortFn: () => void
    let abortRequested = false
    const abort = () => {
      abortRequested = true
      if (abortFn) {
        abortFn()
        return
      }
      setTimeout(abort, 50)
    }

    const run = async () => {
      try {
        const count = await this.readCount(entity, params)
        const chunks = [] as Promise<TOdataReadResult<M['entityTypes'][M['entitySets'][T]]['record']>>[]

        const _params: TODataParams = {
          '$filter': params?.['$filter'],
          '$format': params?.['$format'],
          '$orderby': params?.['$orderby'],
          '$select': params?.['$select'],
          '$expand': params?.['$expand'],
          'search': params?.search,
          'search-focus': params?.['search-focus'],
          '$top': chunkSize,
          '$skip': 0,
        }
        for (let skip = 0; skip < count; skip += chunkSize) {
          chunks.push(batch.read(entity, { ..._params, $skip: skip }))
        }

        // @ts-expect-error
        const { abort, promise } = batch.execute({
          maxBatchLength: 1,
          maxConcurrentBatches: 3,
        })
        abortFn = abort
        if (abortRequested) {
          return []
        }
        const results = [] as TOdataRecord<M['entityTypes'][M['entitySets'][T]]['record']>[]
        for (let i = 0; i < chunks.length; i++) {
          if (abortRequested) {
            break
          }
          const chunk = chunks[i]
          if (chunk instanceof Promise) {
            const { data } = await chunk
            if (data?.length) {
              results.push(...data)
              params?.progressCb?.(results.length, count, false)
            }
          }
        }

        params?.progressCb?.(results.length, count, true)
        return results
      } catch (error) {
        abortFn = () => {}
        throw error
      }
    }
    return {
      abort,
      promise: run(),
    }
  }

  getRecordV2Metadata<T = Record<string, string>>(record: T) {
    const { __metadata } = record as unknown as { __metadata: T__Metadata }
    return __metadata
  }

  /**
   * Reads a record from the specified OData entity set using the provided key.
   *
   * @template T - The key of the entity set in the OData model.
   * @param {string} key - The key to identify the record.
   * @returns {Promise<TWrapODataRecord<M['entityTypes'][M['entitySets'][T]]['fields']>>} - The data read from the entity set.
   * @throws {Error} - Throws an error if the OData request fails.
   */
  async readRecordByKey<T extends keyof M['entitySets']>(key: string) {
    const data = await this._fetch<TWrapODataRecord<M['entityTypes'][M['entitySets'][T]]['record']>>(
      this.genRequestUrl(key),
      {
        method: 'GET',
        headers: {
          ...this.options.headers,
          accept: 'application/json',
        },
      },
      'json'
    )
    return data
  }

  /**
   * Reads a record from the specified OData entity set using the provided record object.
   *
   * @template T - The key of the entity set in the OData model.
   * @param {Partial<M['entityTypes'][M['entitySets'][T]]['record']>} record - The record object to identify the record (must include all key fields).
   * @returns {Promise<M['entityTypes'][M['entitySets'][T]]['record']>} - The data read from the entity set.
   * @throws {Error} - Throws an error if the OData request fails or if the URI parsing fails.
   */
  async readRecord<T extends keyof M['entitySets']>(
    entitySet: T,
    record: Partial<M['entityTypes'][M['entitySets'][T]]['record']>
  ): Promise<M['entityTypes'][M['entitySets'][T]]['record']> {
    const m = await this.getMetadata()
    const es = m.getEntitySet(entitySet)
    const path = es.prepareRecordKey(record as any)
    const data = await this._fetch<TWrapODataRecord<M['entityTypes'][M['entitySets'][T]]['record']>>(
      this.genRequestUrl(path),
      {
        method: 'GET',
        headers: {
          ...this.options.headers,
          accept: 'application/json',
        },
      },
      'json'
    )
    return (m.isV4 ? data : data.d) as M['entityTypes'][M['entitySets'][T]]['record']
  }

  async updateRecordByKey<T extends keyof M['entitySets']>(
    key: string,
    change: Partial<M['entityTypes'][M['entitySets'][T]]['record']>
  ) {
    return this._fetch<void>(
      this.genRequestUrl(key),
      {
        method: 'PUT',
        headers: {
          ...this.options.headers,
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(change),
      },
      'json'
    )
  }

  async updateRecord<T extends keyof M['entitySets']>(
    record: Partial<M['entityTypes'][M['entitySets'][T]]['record']>,
    change: Partial<M['entityTypes'][M['entitySets'][T]]['record']>
  ) {
    const { uri } = this.getRecordV2Metadata(record as any)
    const path = uri.split(this.service)[1]?.slice(1)
    if (path) {
      return this._fetch<void>(
        this.genRequestUrl(path),
        {
          method: 'PUT',
          headers: {
            ...this.options.headers,
            'accept': 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify(change),
        },
        'json'
      )
    }
    throw new Error(`Failed parsing __metadata.uri: ${uri}`)
  }

  protected _csrfToken: {
    value: string
    expires: number
    promise?: Promise<string>
  } = {
    value: '',
    expires: 0,
  }

  async getCSRF() {
    const time = Date.now()
    if (this._csrfToken.expires < time) {
      if (this._csrfToken.promise) return this._csrfToken.promise
      this._csrfToken.promise = new Promise((resolve, reject) => {
        fetch(this.genRequestUrl(''), {
          method: 'HEAD',
          headers: {
            'X-CSRF-Token': 'fetch',
            ...this.options.headers,
          },
        })
          .then(resp => {
            const csrfToken = resp.headers.get('X-CSRF-Token') || ''
            if (!csrfToken) {
              reject(new IFetchError('Failed to retrieve CSRF token', resp.status, resp.statusText))
            }
            resolve(csrfToken)
          })
          .catch(reject)
      })
      this._csrfToken.value = await this._csrfToken.promise
      this._csrfToken.promise = undefined
      this._csrfToken.expires = time + (this.options.csrfTtl || 60000 * 3)
    }

    return this._csrfToken.value
  }

  protected _metadataInstance?: Promise<Metadata<M>>

  async readMetadata() {
    return this._fetch<string>(
        this.genRequestUrl('$metadata'),
        {
          method: 'GET',
          headers: {
            ...this.options.headers,
            accept: 'application/xml',
          },
        },
        'xml',
        true
      ).then(xml => {
        if (xml.startsWith('<html>')) {
          throw new IFetchError(`Failed to read metadata of "${this.service}"`, 200, 'OK')
        }
        return xml
      })
  }

  async entitySet<T extends keyof M['entitySets']>(name: T): Promise<EntitySet<M, T, M['entitySets'][T]>>  {
    const m = await this.getMetadata()
    return m.getEntitySet(name)
  }

  async getMetadata() {
    if (!this._metadataInstance) {
      this._metadataInstance = (async () => {
        const xml = await this.readMetadata()
        return new Metadata<M>(xml, this, this.service)
      })()
    }
    return this._metadataInstance
  }

  async callFunction<T extends keyof M['functions']>(
    name: T,
    _params?: M['functions'][T]['params'],
    disableBatch?: boolean,
    prefix?: string,
  ): Promise<M['functions'][T]['returnType']> {
    return this._callFunction(name as string, _params, disableBatch, 'GET', prefix)
  }

  async callAction<T extends keyof M['actions']>(
    name: T,
    _params?: M['actions'][T]['params'],
    disableBatch?: boolean,
    prefix?: string,
  ): Promise<M['actions'][T]['returnType']> {
    return this._callFunction(name as string, _params, disableBatch, 'POST', prefix)
  }

  protected async _callFunction(
    name: string,
    _params?: unknown,
    disableBatch?: boolean,
    method: 'GET' | 'POST' = 'GET',
    prefix?: string,
  ): Promise<unknown> {
    const metadata = await this.getMetadata()
    const fnMeta = metadata.getFunction(name as string)
    if (!fnMeta) {
      throw new Error(`Function "${name as string}" not found in metadata of "${this.service}"`)
    }
    const params = {} as Record<string, unknown>
    const target = method === 'POST' ? 'json' : 'filter'
    if (_params) {
      for (const param of fnMeta.params ?? []) {
        const paramName = param.$Name
        if (paramName in (_params as Record<string, any>)) {
          const value = (_params as Record<string, any>)[paramName]
          params[param.$Name] = target === 'filter' ? odataValueFormat.toFilter[param.$Type as 'Edm.String'](value as string)
            : odataValueFormat.toJson[param.$Type as 'Edm.String'](value as string)
        }
      }
      if (!Object.keys(params).length) {
        for (const [key, value] of Object.entries(_params as Record<string, unknown>)) {
          if (value === undefined || value === null) continue
          if (target === 'filter') {
            if (typeof value === 'number' || typeof value === 'boolean') {
              params[key] = String(value)
            } else {
              params[key] = `'${String(value)}'`
            }
          } else {
            params[key] = value
          }
        }
      }
    }

    const isV4 = metadata.isV4
    const fnName = fnMeta.name
    const requestPath = (() => {
      if (!isV4 || method === 'POST') {
        return name as string
      }
      const entries = Object.entries(params)
      if (!entries.length) {
        return `${fnName}()`
      }
      const args = entries.map(([key, value]) => `${key}=${value}`).join(',')
      return `${fnName}(${args})`
    })()
    const prefixedPath = prefix ? `${prefix}/${requestPath}` : requestPath

    const requestParams = !isV4 || method === 'POST' ? params as Record<string, string> : undefined
    if (method === 'GET') {
      const data = await this._fetch(
        this.genRequestUrl(prefixedPath, requestParams),
        {
          method,
          headers: {
            ...this.options.headers,
            accept: 'application/json',
          },
        },
        'json',
        disableBatch
      )
      return isV4 ? data : (data as {d: unknown}).d
    } else {
      const data = await this._fetch(
        this.genRequestUrl(prefixedPath),
        {
          method,
          headers: {
            ...this.options.headers,
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify(requestParams),
        },
        'json',
        disableBatch
      )
      const isCollection = fnMeta.returnType?.type?.startsWith('Collection(')
      return isV4 ? (data as any).value : isCollection ? ((data as any).d?.results || (data as any).d) : (data as any).d
    }
  }

  /* =========================================
   =            Batch Feature              =
   ========================================= */

  protected requests: TOdataBatchRequestItem[] = []

  createBatch() {
    return new ODataBatch<M>(this.service, this.options, this._metadataInstance, this._csrfToken)
  }

  // Generate a random boundary string
  private _generateBoundary(): string {
    return Math.random().toString(36).substring(2)
  }

  protected async _addRequestToBatch<T>(
    url: string,
    options: {
      method: string
      headers?: Record<string, string>
      body?: string
    }
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requests.push({
        method: options.method || 'GET',
        url: url,
        headers: {
          ...this.options.headers,
          ...options.headers,
        },
        body: options.body,
        resolve,
        reject,
      })
    }) as Promise<T>
  }

  private _executeBatchDebounced = debounce(() => {
    this.executeBatch()
  }, 10)

  /**
   * Ensures that the metadata instance is fully loaded before proceeding.
   * This method checks if the metadata instance exists and waits for it to load,
   * including a brief pause to ensure all related requests are properly recorded.
   */
  protected async ensureMetadataLoaded() {
    if (this._metadataInstance) {
      await this._metadataInstance
      // Wait a bit to make sure the metadata is loaded and requests are recorded to batch queue
      await new Promise(resolve => setTimeout(resolve, 1))
    }
  }

  protected async executeBatch(requests?: TOdataBatchRequestItem[]): Promise<void> {
    await this.ensureMetadataLoaded()
    const _requests = requests || this.requests
    if (!requests) {
      this.requests = []
    }
    const batchBoundary = 'batch_' + this._generateBoundary()
    const batchBody = this._constructBatchBody(_requests, batchBoundary)

    // Send the batch request
    try {
      const response = await ifetch<string>(this.genRequestUrl('$batch'), {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/mixed; boundary=${batchBoundary}`,
          'accept': 'multipart/mixed',
          ...(this.options.handleCsrf ? {
            'x-csrf-token': await this.getCSRF(),
          } : {}),
          ...this.options.headers,
        },
        body: batchBody,
      })

      const contentType = response.headers.get('content-type') || ''
      const boundary = contentType.split('boundary=')[1] || ''
      // Parse the batch response
      this._parseBatchResponse(_requests, response.body, boundary)
    } catch (error) {
      // Reject all promises
      _requests.forEach(req => {
        req.reject(error)
      })
    }
  }

  private _constructBatchBody(requests: TOdataBatchRequestItem[], batchBoundary: string): string {
    let body = ''
    let changeSetBoundary = ''
    requests.forEach(req => {
      const needChangeset = req.method !== 'GET' // && req.asChangeset
      if (needChangeset && !changeSetBoundary) {
        changeSetBoundary = 'changeset_' + this._generateBoundary()
        body += `--${batchBoundary}\r\n`
        body += `Content-Type: multipart/mixed; boundary=${changeSetBoundary}\r\n\r\n`
        body += `--${changeSetBoundary}\r\n`
      } else if (!needChangeset && changeSetBoundary) {
        body += `--${changeSetBoundary}--\r\n\r\n`
        changeSetBoundary = ''
        body += `--${batchBoundary}\r\n`
      } else if (needChangeset && changeSetBoundary) {
        body += `--${changeSetBoundary}\r\n\r\n`
      } else {
        body += `--${batchBoundary}\r\n`
      }
      body += 'Content-Type: application/http\r\n'
      body += 'Content-Transfer-Encoding: binary\r\n\r\n'

      const relativeUrl = req.url.replace(`${this.host}${this.url}${this.service}/`, '')

      const headers = req.headers || ({} as Record<string, string>)
      if (req.body) {
        headers['Content-Length'] = req.body.length.toString()
      }

      body += `${req.method} ${relativeUrl} HTTP/1.1\r\n`
      Object.keys(headers).forEach(header => {
        body += `${header}: ${headers[header]}\r\n`
      })
      body += '\r\n'

      if (req.body) {
        body += req.body
      }
      body += '\r\n'
    })

    if (changeSetBoundary) {
      body += `--${changeSetBoundary}--\r\n\r\n`
    }
    body += `--${batchBoundary}--\r\n`

    return body
  }

  private _parseBatchResponse(
    requests: TOdataBatchRequestItem[],
    responseText: string,
    batchBoundary: string,
    _index: { value: number } = { value: 0 }
  ): void {
    // Split the response by the batch boundary
    const parts = responseText
      .split(`--${batchBoundary}`)
      .filter(part => part.trim() && part.trim() !== '--')

    // For each part, parse the response and resolve/reject the corresponding promise
    parts.forEach(part => {
      const req = requests[_index.value]!
      const trimmedPart = part.trim()

      // Split the part into batch part headers and the HTTP response
      const [batchHeadersPart, statusLineAndHeaders, bodyText] = trimmedPart.split(/\r?\n\r?\n/, 3)
      if (!statusLineAndHeaders) {
        req.reject(new Error('Invalid batch response format: missing HTTP response'))
        return
      }

      const batchHeaders = extractBatchHeaders(batchHeadersPart!)
      if (batchHeaders['content-type']?.includes('multipart/mixed')) {
        const boundary = batchHeaders['content-type'].split('boundary=')[1]
        this._parseBatchResponse(
          requests,
          trimmedPart.slice(batchHeadersPart?.length || 0),
          boundary!,
          _index
        )
      } else {
        const httpResponseLines = statusLineAndHeaders.split(/\r?\n/)
        const headers = extractBatchHeaders(httpResponseLines.slice(1).join('\r\n'))

        if (bodyText === undefined && headers['content-length'] !== '0') {
          req.reject(new Error('Invalid HTTP response format: missing body'))
          return
        }

        const statusLine = httpResponseLines[0]
        if (!statusLine) {
          req.reject(new Error('Missing status line in HTTP response'))
          return
        }

        const statusMatch = statusLine.match(/HTTP\/1\.\d (\d{3}) (.*)/) ?? [, '']
        if (!statusMatch) {
          req.reject(new Error('Invalid response status line'))
          return
        }

        const status = parseInt(statusMatch[1], 10)
        const statusText = statusMatch[2]

        let body: any = bodyText

        // Parse body based on content type
        const contentType = headers['content-type'] || ''
        if (contentType.includes('application/json')) {
          try {
            body = JSON.parse(bodyText || '')
          } catch (e) {
            req.reject(new Error('Failed to parse JSON response'))
            return
          }
        }

        // Check status code
        if (status >= 200 && status < 300) {
          // Success
          req.resolve(body)
        } else {
          // Error
          if (isSapODataError(body)) {
            req.reject(new SapODataError(body, status, statusText!))
          } else {
            const errorMessage = extractGenericErrorMessage(body) || 'Unknown Error'
            req.reject(new IFetchError<string>(errorMessage, status, statusText!))
          }
        }
        _index.value++
      }
    })
  }
}

export class ODataBatch<M extends TOdataDummyInterface = TOdataDummyInterface> extends OData<M> {
  constructor(
    service: string,
    options: TODataOptions = {},
    metadata: Promise<Metadata<M>> | undefined,
    csrfToken: OData['_csrfToken']
  ) {
    super(service, options)
    this._metadataInstance = metadata
    this._csrfToken = csrfToken
  }

  override async _fetch<T>(
    url: string,
    options: { method: string; headers?: Record<string, string>; body?: string },
    expectedFormat: 'json' | 'xml' | 'xlsx' | 'multipart',
    disableBatch?: boolean
  ): Promise<T> {
    if (disableBatch) {
      return super._fetch<T>(url, options, expectedFormat, disableBatch)
    }
    return this._addRequestToBatch<T>(url, options)
  }

  execute(options?: { maxBatchLength?: number; maxConcurrentBatches?: number }) {
    const maxBatchLength = options?.maxBatchLength || 100
    const maxConcurrentBatches = options?.maxConcurrentBatches || 10

    let currentBatch = 0
    let abortRequested = false
    let totalBatches = 0
    let chunks: TOdataBatchRequestItem[][] = []

    const processBatch = async (batchItems: TOdataBatchRequestItem[]) => {
      try {
        await this.executeBatch(batchItems)
      } catch (err) {
        console.error('Batch execution failed:', err)
      }
    }

    const runWorker = async () => {
      // eslint-disable-next-line no-constant-condition
      while (!abortRequested) {
        if (currentBatch >= totalBatches) break
        const batchItems = chunks[currentBatch++]!
        await processBatch(batchItems)
      }
    }

    const run = async () => {
      await this.ensureMetadataLoaded()
      chunks = chunkArray(this.requests, maxBatchLength)
      totalBatches = chunks.length
      const workers: Promise<void>[] = []

      for (let i = 0; i < maxConcurrentBatches; i++) {
        workers.push(runWorker())
      }

      return Promise.all(workers)
    }
    const abort = () => {
      abortRequested = true
      for (let i = currentBatch; i < totalBatches; i++) {
        chunks[i]?.forEach(req => req.reject(new Error('Batch execution aborted')))
      }
    }

    return { abort, promise: run() }
  }
}

const modelMap = new Map<string, OData<any>>()

export function useModel<M extends TOdataDummyInterface = TOdataDummyInterface>(
  service: string,
  options?: TODataOptions
) {
  const key = `${options?.path || ODATA_PATH}/${service}`
  let model = modelMap.get(key)
  if (!model) {
    model = new OData<M>(service, options)
    modelMap.set(key, model)
  }
  return model as OData<M>
}

function extractBatchHeaders(lines: string) {
  const parts = lines.split(/\r?\n/)
  // Parse HTTP headers
  const headers: Record<string, string> = {}
  for (const line of parts) {
    const trimmedLine = line.trim()
    if (trimmedLine === '') {
      continue // Skip empty lines
    }
    const [headerName, headerValue] = line.split(': ')
    if (headerName && headerValue) {
      headers[headerName.toLowerCase()] = headerValue
    }
  }
  return headers
}
