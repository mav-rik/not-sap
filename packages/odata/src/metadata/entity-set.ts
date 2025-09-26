import type { Metadata, RawMetadataProperty } from './metadata'
import {
  type TODataFilters,
  type TODataValueType,
} from './format-filters'
import { type TOdataDummyInterface, type TODataParams } from '../odata'
import { type TPropertyAnnotations } from './annotations'
import { ExcelGenerator, type TExcelSubtotalConfig } from './excel'
import { EntityType } from './entity-type'
import { EntityRecord } from './entity-record'

export type NavProperties<T extends PropertyKey = string> = NavProperty<T>[]

export type NavProperty<T extends PropertyKey = string> = RawMetadataProperty<T> & {
  toMany: boolean
  target: string
}

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
  ET extends keyof TOdataDummyInterface['entityTypes'] = M['entitySets'][T]
> extends EntityType<M, ET> {
  public readonly typeName: string
  public readonly entitySetNS: string
  readonly recordId: (record: Record<M['entityTypes'][ET]['fields'], string | undefined>) => string

  constructor(
    _m: Metadata<M>,
    protected _ref: T | {
      prefix: string
      entityTypeName: string
    }
  ) {
    let typeName
    if (typeof _ref === 'object') {
      typeName = _ref.entityTypeName
    } else {
      const _set = _m.getRawEntitySet(_ref)!
      typeName = _set.$EntityType
    }
    super(_m, typeName as ET)

    this.typeName = typeName
    if (typeof _ref === 'object') {
      this.entitySetNS = ''
    } else {
      this.entitySetNS = (_ref as string).split('.').slice(0, -1).join('.')
    }
    
    type RecordType = Record<M['entityTypes'][ET]['fields'], string | undefined>

    this.recordId = ((keys: string[]): ((record: RecordType) => string) => {
      const template = keys.map(key => `\${record['${key}']}`).join('/')
      const functionBody = `return record.__metadata?.id || \`${template}\``
      return new Function('record', functionBody) as (record: RecordType) => string
    })(this.keys)
  }

  override get name() {
    return (typeof this._ref === 'object' ? this._ref.prefix : this._ref) as string
  }

  /**
   * Prepares a record key for an entity set based on the provided key-value pairs.
   *
   * @param keys - A record containing the key fields and their corresponding values.
   * @returns A string representing the prepared record key in the format "EntitySetName(key1=value1,key2=value2,...)"
   * @throws Will throw an error if a key field is not provided in the input keys.
   */
  prepareRecordKey(keys: Record<M['entityTypes'][ET]['keys'], string>) {
    const _keys = [] as string[]
    for (const k of this.keys) {
      const field = this.fieldsMap.get(k as M['entityTypes'][ET]['fields'])!
      if (Object.prototype.hasOwnProperty.call(keys, field.$Name)) {
        const prefix = this.keys.length ? `${k}=` : ''
        _keys.push(`${prefix}${field.fromJson.toFilter(keys[k])}`)
      } else {
        throw new Error(`Key field "${field.$Name}" not provided`)
      }
    }
    return `${this.name as string}(${_keys.join(',')})`
  }

  async readRecord(keys: Record<M['entityTypes'][ET]['keys'], string>) {
    const key = this.prepareRecordKey(keys)
    return this.getModel().readRecordByKey(key)
  }

  withKey(keys: Record<M['entityTypes'][ET]['keys'], string>) {
    const key = this.prepareRecordKey(keys)
    return new EntityRecord(this._m, this._entityType, key)
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
      const field = this.fieldsMap.get(item as M['entityTypes'][ET]['fields'])
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

    const prefix = typeof this._ref === 'object' ? this._ref.prefix : this._ref
    return {
      entitySet: prefix as T,
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
    columnsNames: M['entityTypes'][ET]['fields'][],
    dataRows: Record<M['entityTypes'][ET]['fields'], TODataValueType>[],
    opts?: {
      subtotals?: TExcelSubtotalConfig<M, T>[]
    }
  ) {
    const eg = new ExcelGenerator<M, T>(
      (f: M['entityTypes'][ET]['fields']) => this.getField(f),
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
    | TODataFilters<M['entityTypes'][M['entitySets'][T]]['fields']>[number]
    | TODataFilters<M['entityTypes'][M['entitySets'][T]]['fields']>
  select?: M['entityTypes'][M['entitySets'][T]]['fields'][]
  searchFocus?: M['entityTypes'][M['entitySets'][T]]['fields']
  search?: string
  sorters?: TEntitySetSorter[]
  inlinecount?: 'allpages'
  apply?: {
    filters?:
      | string
      | TODataFilters<M['entityTypes'][M['entitySets'][T]]['fields']>[number]
      | TODataFilters<M['entityTypes'][M['entitySets'][T]]['fields']>
    group?: {
      fields: M['entityTypes'][M['entitySets'][T]]['fields'][]
      aggregate: M['entityTypes'][M['entitySets'][T]]['measures'][]
    }
  }
}
