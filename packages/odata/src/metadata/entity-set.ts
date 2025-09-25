import type { Metadata, TSchema, RawMetadataProperty } from './metadata'
import { odataValueFormat } from './format-edm'
import {
  odataFilterFormat,
  type TODataFilter,
  type TODataFilterAnd,
  type TODataFilterConditionType,
  type TODataFilterOr,
  type TODataFilters,
  type TODataFilterValWithType,
  type TODataValueType,
} from './format-filters'
import { getMetadataRefiner } from './refiner'
import { useModel, type TOdataDummyInterface, type TODataParams } from '../odata'
import { convertAnnotations, type TPropertyAnnotations } from './annotations'
import { joinPath } from '../utils'
import { ExcelGenerator, type TExcelSubtotalConfig } from './excel'

/**
 * Represents an array of EntitySetField objects, each corresponding to a field within an EntitySet.
 *
 * @template T - The type of the property key, defaulting to string.
 */
export type EntitySetFields<T extends PropertyKey = string> = EntitySetField<T>[]

/**
 * Represents a field within an EntitySet, including metadata and methods for data transformation.
 *
 * @template T - The type of the property key, defaulting to string.
 */
export type EntitySetField<T extends PropertyKey = string> = RawMetadataProperty<T> & {
  /**
   * has Edm.Decimal or other numeric type
   */
  isNumber: boolean
  /**
   * has v4 SAP__aggregation.CustomAggregate
   */
  isMeasure: boolean
  annotations: TPropertyAnnotations
  fromJson: {
    toFilter: (v: string | number | Date | boolean) => string
    toDisplay: (v: string | number | Date | boolean) => string
  }
  fromRaw: {
    toJson: (v: string) => string | boolean | number | Date
    toFilter: (v: string) => string
    toDisplay: (v: string) => string
  }
}

/**
 * Represents an EntitySet which provides methods to interact with and manipulate metadata and data for a specific entity set.
 *
 * @template M - The metadata interface type.
 * @template T - The type of the entity set name.
 */
export class EntitySet<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entitySets'] = string,
> {
  protected _type: TSchema['EntityType'][number]
  protected _set: Required<TSchema>['EntityContainer']['EntitySet'][number]
  protected _fields?: EntitySetFields<M['entitySets'][T]['fields']>
  protected _keys?: M['entitySets'][T]['keys'][]
  protected _fieldsMap?: Map<
    M['entitySets'][T]['fields'],
    EntitySetField<M['entitySets'][T]['fields']>
  >
  protected _selfAnnotContainer?: TPropertyAnnotations
  protected _selfAnnotContainerName?: TPropertyAnnotations
  protected _selfAnnotCommon?: TPropertyAnnotations

  /**
   * SAP__self.Container
   *
   * SAP__CodeList.CurrencyCodes
   * SAP__aggregation.ApplySupported
   * SAP__common.ApplyMultiUnitBehaviorForSortingAndFiltering
   * SAP__capabilities.FilterFunctions
   */
  get selfAnnotContainer() {
    if (!this._selfAnnotContainer) {
      this._selfAnnotContainer = convertAnnotations(
        this._m.getRawAnnotations('SAP__self.Container')
      )
    }
    return this._selfAnnotContainer
  }

  /**
   * SAP__self.Container/{name}
   *
   * SAP__capabilities.SearchRestrictions
   * SAP__capabilities.InsertRestrictions
   * SAP__capabilities.DeleteRestrictions
   * SAP__capabilities.UpdateRestrictions
   * SAP__capabilities.FilterRestrictions
   * SAP__core.OptimisticConcurrency
   */
  get selfAnnotContainerName() {
    if (!this._selfAnnotContainerName) {
      this._selfAnnotContainerName = convertAnnotations(
        this._m.getRawAnnotations('SAP__self.Container/' + (this._name as string))
      )
    }
    return this._selfAnnotContainerName
  }

  /**
   * SAP__self.{name}Type
   *
   * SAP__UI.Facets
   * SAP__UI.HeaderInfo
   * SAP__UI.Identification
   * SAP__UI.LineItem
   * SAP__UI.SelectionFields
   */
  get selfAnnotCommon() {
    if (!this._selfAnnotCommon) {
      this._selfAnnotCommon = convertAnnotations(this._m.getRawAnnotations(this.selfDataType))
    }
    return this._selfAnnotCommon
  }

  readonly recordId: (record: Record<M['entitySets'][T]['fields'], string | undefined>) => string

  constructor(
    protected _m: Metadata<M>,
    protected _name: T
  ) {
    this._set = _m.getRawEntitySet(_name)!
    this._type = _m.getRawEntityType(this._set.$EntityType)!

    type RecordType = Record<M['entitySets'][T]['fields'], string | undefined>

    this.recordId = ((keys: string[]): ((record: RecordType) => string) => {
      const template = keys.map(key => `\${record['${key}']}`).join('/')
      const functionBody = `return record.__metadata?.id || \`${template}\``
      return new Function('record', functionBody) as (record: RecordType) => string
    })(this.keys)
  }

  get name() {
    return this._name
  }

  getType() {
    return this._type
  }

  getLabel() {
    return (this._type.$label || this.selfAnnotCommon?.['SAP__common.Label'] || this._name) as
      | string
      | undefined
  }

  get keys() {
    if (!this._keys) {
      this._keys = this._type.Key.PropertyRef.map(k => k.$Name) as M['entitySets'][T]['keys'][]
    }
    return this._keys
  }

  /**
   * Refines a specific field of the entity set with the provided data.
   * Replaces metadata for the field with the provided data.
   *
   * @param field - The field of the entity set to be refined.
   * @param data - Partial data to refine the field, excluding the '$Name' property.
   */
  refineField(
    field: M['entitySets'][T]['fields'],
    data: Partial<Omit<RawMetadataProperty, '$Name'>>
  ) {
    return getMetadataRefiner().refineField(this._m.name || '', this._name as string, field, data)
  }

  get fields(): EntitySetFields<M['entitySets'][T]['fields']> {
    if (!this._fields) {
      this._updateFields()
    }
    return this._fields!
  }

  private _updateFields() {
    const refiner = getMetadataRefiner()
    const fm = this._fieldsMap
    if (!this._fields) {
      refiner.subscribe(this._m.name || '', this._name as string, this._updateFields.bind(this))
    } else {
      this._fieldsMap = undefined
    }
    this._fields = this._type.Property.map(p => {
      const annotations =
        fm?.get(p.$Name)?.annotations ||
        convertAnnotations(this._m.getRawAnnotations(`${this.selfDataType}/${p.$Name}`))
      const v4Attrs = {} as EntitySetField<M['entitySets'][T]['fields']>
      if (this._m.isV4) {
        v4Attrs.$label = annotations?.['SAP__common.Label']
        v4Attrs.$quickinfo = annotations?.['SAP__common.QuickInfo']
        v4Attrs['$display-format'] = annotations?.['SAP__common.IsUpperCase']
          ? 'UpperCase'
          : undefined
        v4Attrs['$unit'] = annotations?.['SAP__measures.ISOCurrency']
        v4Attrs['$semantics'] = annotations?.['SAP__common.IsCurrency']
          ? 'currency-code'
          : undefined
        v4Attrs['isMeasure'] = !!annotations?.['SAP__aggregation.CustomAggregate']
      }
      return {
        ...p,
        ...v4Attrs,
        $label: p.$label ?? v4Attrs.$label ?? p.$Name,
        ...refiner.refinedField(this._m.name || '', this._name as string, p.$Name),
        isNumber: ['Edm.Decimal', 'Edm.Int8', 'Edm.Int16', 'Edm.Int32', 'Edm.Int64'].includes(p.$Type),
        fromJson: {
          toFilter: odataValueFormat.toFilter[p.$Type],
          toDisplay: odataValueFormat.toDisplay[p.$Type],
        },
        fromRaw: {
          toJson: odataValueFormat.toJson[p.$Type],
          toFilter: (v: string) =>
            odataValueFormat.toFilter[p.$Type](odataValueFormat.toJson[p.$Type](v)),
          toDisplay: ((v: string) =>
            odataValueFormat.toDisplay[p.$Type](odataValueFormat.toJson[p.$Type](v))) as (
            v: string
          ) => string,
        },
        annotations,
      } as EntitySetField<M['entitySets'][T]['fields']>
    })
  }

  get selfDataType() {
    return this._m.isV4 ? `SAP__self.${this._type.$Name}` : this._set.$EntityType
  }

  get fieldsMap(): Map<M['entitySets'][T]['fields'], EntitySetField> {
    if (!this._fieldsMap) {
      this._fieldsMap = new Map<
        M['entitySets'][T]['fields'],
        EntitySetField<M['entitySets'][T]['fields']>
      >()
      for (const f of this.fields) {
        this._fieldsMap.set(
          f.$Name as unknown as M['entitySets'][T]['fields'],
          f as unknown as EntitySetField<M['entitySets'][T]['fields']>
        )
      }
    }
    return this._fieldsMap
  }

  getField(name: M['entitySets'][T]['fields']) {
    return this.fieldsMap.get(name)
  }

  hasValueHelp(field: M['entitySets'][T]['fields']) {
    return (
      (this._m.isV4 && this.fieldsMap.get(field)?.annotations['SAP__common.ValueListReferences']) ||
      this.fieldsMap.get(field)?.annotations['Common.ValueList']?.CollectionPath
    )
  }

  getModel() {
    return this._m.model
  }

  protected _vhMap = new Map<string, Promise<EntitySet | undefined>>()

  async getReferenceMetadata(refPath: string) {
    const p = joinPath(this._m.model.url, refPath).split('/').slice(0, -1)
    const name = p[p.length - 1]!
    const model = useModel(name, { path: p.join('/'), host: this._m.model.host })
    return model.getMetadata()
  }

  async getCurreciesEntitySet() {
    const target = this.selfAnnotContainer?.['SAP__CodeList.CurrencyCodes']
    if (target) {
      const m = await this.getReferenceMetadata(target.Url)
      return m.getEntitySet(target.CollectionPath)
    }
    return undefined
  }

  async readCurrencies() {
    if (!cachedCurrecies) {
      const es = await this.getCurreciesEntitySet()
      if (es && !cachedCurrecies) {
        cachedCurrecies = new Promise((resolve, reject) => {
          es.query({})
            .then(({ data }) => {
              const m = new Map<string, TEntityCurrencyEntry>()
              for (const entry of data as unknown as TEntityCurrencyEntry[]) {
                m.set(entry.ISOCode, entry)
              }
              resolve(m)
            })
            .catch(e => {
              reject(e)
              cachedCurrecies = undefined
            })
        })
      }
    }
    return cachedCurrecies
  }

  async getValueHelpEntitySet(field: M['entitySets'][T]['fields']) {
    let cached = this._vhMap.get(field)
    if (!cached) {
      cached = new Promise((resolve, reject) => {
        const f = this.fieldsMap.get(field)
        if (this._m.isV4) {
          const path = f?.annotations['SAP__common.ValueListReferences']
          if (path) {
            const parentTypeFallback = `${path
              .split('.')
              .slice(-2, -1)?.[0]
              ?.split('-')
              .pop()
              ?.toUpperCase()}Type`
            this.getReferenceMetadata(path).then(m => {
              const valueHelpAnnot =
                m.getRawAnnotations(`SAP__ParentService.${this._type.$Name}/${field}`) ||
                m.getRawAnnotations(`SAP__ParentService.${parentTypeFallback}/${field}`)
              if (valueHelpAnnot) {
                const converted = convertAnnotations(valueHelpAnnot)
                if (converted['SAP__common.ValueListMapping']) {
                  const es = m.getEntitySet(
                    converted['SAP__common.ValueListMapping'].CollectionPath
                  )
                  f.annotations['Common.ValueList'] = converted['SAP__common.ValueListMapping']
                  f.annotations['Common.ValueList'].SearchSupported =
                    es.selfAnnotContainerName?.['SAP__capabilities.SearchRestrictions']?.Searchable
                  resolve(es)
                  return
                }
              }
              reject(new Error(`Failed to parse value-list metadata for ${field}`))
            })
          }
        } else if (f?.annotations['Common.ValueList']?.CollectionPath) {
          resolve(
            this._m.getEntitySet(f.annotations['Common.ValueList'].CollectionPath) as EntitySet<
              TOdataDummyInterface,
              string
            >
          )
        }
      })
    }
    return cached
  }

  /**
   * Renders an OData filter string based on the provided filter object or string.
   *
   * @param filter - The filter to be rendered. It can be a string, a single filter object, or an array of filter objects.
   * @param joinWith - The logical operator to join multiple filters. It can be 'and' or 'or'. Default is 'and'.
   * @returns A string representing the rendered OData filter.
   */
  renderFilter(
    filter:
      | string
      | TODataFilters<M['entitySets'][T]['fields']>[number]
      | TODataFilters<M['entitySets'][T]['fields']>,
    joinWith: 'and' | 'or' = 'and'
  ): string {
    if (typeof filter === 'string') {
      return filter
    }
    const filters: TODataFilters<M['entitySets'][T]['fields']> = Array.isArray(filter)
      ? filter
      : [filter]
    const rendered = filters
      .map(_f => {
        const f = _f as TODataFilterAnd<M['entitySets'][T]['fields']> &
          TODataFilterOr<M['entitySets'][T]['fields']> &
          TODataFilter<M['entitySets'][T]['fields']>
        if (f.$and) {
          return this.renderFilter(f.$and, 'and')
        }
        if (f.$or) {
          return this.renderFilter(f.$or, 'or')
        }
        for (const [field, val] of Object.entries(
          f as TODataFilter<M['entitySets'][T]['fields']>
        )) {
          const typed: TODataFilterValWithType | undefined =
            typeof val === 'string'
              ? odataFilterFormat.fromString(val)
              : (val as TODataFilterValWithType)
          if (!typed) return ''
          const type = Object.keys(typed)[0] as TODataFilterConditionType
          if (!odataFilterFormat.toFilter[type]) return ''
          const v = typed[type as keyof typeof typed] as
            | string
            | number
            | boolean
            | [string | number | boolean]
            | [string, string]
            | [number, number]
          const v1 = Array.isArray(v) ? v[0] : v
          const v2 = Array.isArray(v) ? v[1] : v
          const meta = this.getField(field as M['entitySets'][T]['fields'])
          if (meta) {
            return odataFilterFormat.toFilter[type](
              field,
              v1 === undefined ? v1 : meta.fromJson.toFilter(v1),
              v2 === undefined ? v2 : meta.fromJson.toFilter(v2)
            )
          } else {
            return odataFilterFormat.toFilter[type](
              field,
              v1 === undefined ? `'${v1}'` : String(v1),
              v2 === undefined ? `'${v2}'` : String(v2)
            )
          }
        }
      })
      .filter(Boolean)
      .join(` ${joinWith} `)
    return filters.length > 1 ? `(${rendered})` : rendered
  }

  /**
   * Prepares a record key for an entity set based on the provided key-value pairs.
   *
   * @param keys - A record containing the key fields and their corresponding values.
   * @returns A string representing the prepared record key in the format "EntitySetName(key1=value1,key2=value2,...)"
   * @throws Will throw an error if a key field is not provided in the input keys.
   */
  prepareRecordKey(keys: Record<M['entitySets'][T]['keys'], string>) {
    const _keys = [] as string[]
    for (const k of this.keys) {
      const field = this.fieldsMap.get(k as M['entitySets'][T]['fields'])!
      if (Object.prototype.hasOwnProperty.call(keys, field.$Name)) {
        const prefix = this.keys.length ? `${k}=` : ''
        _keys.push(`${prefix}${field.fromJson.toFilter(keys[k])}`)
      } else {
        throw new Error(`Key field "${field.$Name}" not provided`)
      }
    }
    return `${this.name as string}(${_keys.join(',')})`
  }

  async readRecord(keys: Record<M['entitySets'][T]['keys'], string>) {
    const key = this.prepareRecordKey(keys)
    return this.getModel().readRecordByKey(key)
  }

  /**
   * Prepares a query for an entity set based on the provided parameters.
   *
   * @param params - The query parameters for the entity set.
   * @returns An object containing the entity set name and the prepared OData query parameters.
   */
  prepareQuery(params: TEntitySetQueryParams<M, T>): {
    entitySet: T
    params: TODataParams
  } {
    const isV4 = this._m.isV4
    const select = [] as string[]
    for (const item of params.select || ([] as string[])) {
      const field = this.fieldsMap.get(item as M['entitySets'][T]['fields'])
      if (field) {
        select.push(field.$Name)
        if (field.$unit) {
          // for proper display of unit in UI
          // must add sap-unit to select
          select.push(field.$unit)
        }
      }
    }
    const apply = [] as string[]
    if (params.apply) {
      if (params.apply.filters) {
        apply.push(`filter(${this.renderFilter(params.apply.filters)})`)
      }
      if (params.apply.group) {
        apply.push(
          `groupby((${params.apply.group.fields.join(
            ','
          )}),aggregate(${params.apply.group.aggregate.join(',')}))`
        )
      }
    }
    return {
      entitySet: this._name as T,
      params: {
        '$top': params.top ?? 1000,
        '$skip': params.skip,
        '$filter': params.filter ? this.renderFilter(params.filter) || undefined : undefined,
        '$select': select.length ? Array.from(new Set(select)).join(',') : undefined,
        'search-focus': params.searchFocus,
        'search': this._m.isV4 ? undefined : params.search || undefined,
        '$search': this._m.isV4 ? params.search || undefined : undefined,
        '$orderby': params.sorters?.length
          ? params.sorters
              .map(s => (typeof s === 'string' ? s : `${s.name} ${s.desc ? 'desc' : 'asc'}`))
              .join(',')
          : undefined,
        '$inlinecount': isV4 ? undefined : params.inlinecount,
        '$count': isV4 && params.inlinecount ? 'true' : undefined,
        '$apply': apply.length ? apply.join('/') : undefined,
      },
    }
  }

  async query(params: TEntitySetQueryParams<M, T>) {
    const q = this.prepareQuery(params)
    return this.getModel().read(q.entitySet, q.params)
  }

  async generateExcel(
    columnsNames: M['entitySets'][T]['fields'][],
    dataRows: Record<M['entitySets'][T]['fields'], TODataValueType>[],
    opts?: {
      subtotals?: TExcelSubtotalConfig<M, T>[]
    }
  ) {
    const eg = new ExcelGenerator<M, T>(
      (f: M['entitySets'][T]['fields']) => this.getField(f),
      () => this.readCurrencies()
    )
    return eg.generateExcel(columnsNames, dataRows, opts)
  }
}

/**
 * Represents a sorter for an entity set.
 *
 * @typeParam T - The type of the fields in the entity set.
 */
export type TEntitySetSorter<T extends string = string> = { name: T; desc?: boolean } | string

/**
 * Represents the query parameters for an entity set.
 *
 * @typeParam T - The type of the fields in the entity set.
 */
export type TEntitySetQueryParams<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entitySets'] = string,
> = {
  top?: number
  skip?: number
  filter?:
    | string
    | TODataFilters<M['entitySets'][T]['fields']>[number]
    | TODataFilters<M['entitySets'][T]['fields']>
  select?: M['entitySets'][T]['fields'][]
  searchFocus?: M['entitySets'][T]['fields']
  search?: string
  sorters?: TEntitySetSorter[]
  inlinecount?: 'allpages'
  apply?: {
    filters?:
      | string
      | TODataFilters<M['entitySets'][T]['fields']>[number]
      | TODataFilters<M['entitySets'][T]['fields']>
    group?: {
      fields: M['entitySets'][T]['fields'][]
      aggregate: M['entitySets'][T]['measures'][]
    }
  }
}

export interface TEntityCurrencyEntry {
  CurrencyCode: string
  ISOCode: string
  Text: string
  DecimalPlaces: number
}

let cachedCurrecies: Promise<Map<string, TEntityCurrencyEntry>> | undefined = undefined
