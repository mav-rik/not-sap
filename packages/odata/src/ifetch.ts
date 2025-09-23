/**
 * Makes a fetch request and processes the response.
 *
 * @template T - The expected type of the response body.
 * @param {...Parameters<typeof fetch>} args - The arguments to pass to the fetch function.
 * @returns {Promise<T>} - A promise that resolves to the response body.
 * @throws {SapODataError | IFetchError<string | SapODataError>} - Throws a specialized error based on the response.
 */
export async function ifetch<T>(
  ...args: Parameters<typeof fetch>
): Promise<{ status: number; statusText: string; headers: Response['headers']; body: T }> {
  const result = await fetch(...args)
  const ct = result.headers.get('content-type')
  const isJson = ct?.includes('application/json') ?? false
  const body = isJson ? await result.json() : await result.text()

  if (!result.ok) {
    if (isSapODataError(body)) {
      throw new SapODataError(body, result.status, result.statusText)
    } else {
      const errorMessage = extractGenericErrorMessage(body) || 'Unknown Error'
      throw new IFetchError<string>(errorMessage, result.status, result.statusText)
    }
  }

  return {
    status: result.status,
    statusText: result.statusText,
    headers: result.headers,
    body: body as T,
  }
}

/**
 * Checks if the provided body conforms to the SAP OData error format.
 *
 * @param {any} body - The response body to check.
 * @returns {body is TOdataErrorBody} - Type predicate indicating if the body is a TOdataErrorBody.
 */
export function isSapODataError(body: any): body is TOdataErrorBody {
  return (
    body &&
    typeof body === 'object' &&
    body.error &&
    typeof body.error === 'object' &&
    typeof body.error.code === 'string' &&
    body.error.message &&
    typeof body.error.message.value === 'string'
  )
}

/**
 * Extracts a generic error message from the response body.
 *
 * @param {any} body - The response body.
 * @returns {string | null} - The extracted error message or null if not found.
 */
export function extractGenericErrorMessage(body: any): string | null {
  if (typeof body === 'string') {
    return body
  }

  if (typeof body === 'object') {
    if (typeof body.message === 'string') {
      return body.message
    }

    if (typeof body.error?.message === 'string') {
      return body.error.message
    }
  }

  return null
}

/**
 * Represents an error response from an SAP OData service.
 */
export class SapODataError extends Error {
  name = 'SapODataError'

  constructor(
    public body: TOdataErrorBody,
    public status: number,
    public statusText: string
  ) {
    super(body.error.message.value)
    Object.setPrototypeOf(this, SapODataError.prototype)
  }

  /**
   * Shortcut to the main error message.
   */
  get message(): string {
    return this.body.error.message.value
  }

  /**
   * The SAP error code.
   */
  get code(): string {
    return this.body.error.code
  }

  /**
   * Additional SAP-specific error details.
   */
  get details(): TOdataErrorBody['error']['innererror'] {
    return this.body.error.innererror
  }
}

/**
 * Custom error class for fetch-related errors.
 */
export class IFetchError<T = unknown> extends Error {
  name = 'IFetchError'

  constructor(
    public body: T,
    public status: number,
    public statusText: string
  ) {
    super(typeof body === 'string' ? body : 'oData Request failed')
    Object.setPrototypeOf(this, IFetchError.prototype)
  }
}

/**
 * Interface representing the SAP OData error format.
 */
export interface TOdataErrorBody {
  error: {
    code: string
    message: {
      lang: string
      value: string
    }
    innererror: {
      application: {
        component_id: string
        service_namespace: string
        service_id: string
        service_version: string
      }
      transactionid: string
      timestamp: string
      Error_Resolution: {
        SAP_Transaction: string
        SAP_Note: string
      }
      errordetails: unknown[]
    }
  }
}
