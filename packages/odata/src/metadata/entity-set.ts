import type { Metadata, RawMetadataProperty } from './metadata'
import {
  type TODataFilters,
  type TODataValueType,
} from './format-filters'
import { TOdataReadResult, type TOdataDummyInterface } from '../odata'
import { type TPropertyAnnotations } from './annotations'
import { ExcelGenerator, type TExcelSubtotalConfig } from './excel'
import { EntityRecord } from './entity-record'
import { EntityWrapper } from './entity-wrapper'
import { EntityExpand } from './entity-expand'

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
 * Utility type to extract key fields with their proper types from the entity record
 */
type KeysWithTypes<
  M extends TOdataDummyInterface,
  ET extends keyof M['entityTypes']
> = Pick<M['entityTypes'][ET]['record'], M['entityTypes'][ET]['keys']>

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
> extends EntityWrapper<M, ET> {
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
    if (typeof this._ref === 'object') {
      // This is a navigation path, return the full prefix as-is
      return this._ref.prefix
    } else {
      // This is an entity set, return just the name without namespace
      // e.g., "Products" from "ODataWebV4.Northwind.Model.Products"
      return (this._ref as string).split('.').pop()!
    }
  }

  /**
   * Prepares a record key for an entity set based on the provided key-value pairs.
   *
   * @param keys - A record containing the key fields and their corresponding values with proper types.
   * @returns A string representing the prepared record key in the format "EntitySetName(key1=value1,key2=value2,...)"
   * @throws Will throw an error if a key field is not provided in the input keys.
   */
  prepareRecordKey(keys: KeysWithTypes<M, ET>) {
    const _keys = [] as string[]
    for (const k of this.keys) {
      const field = this.fieldsMap.get(k as M['entityTypes'][ET]['fields'])!
      if (Object.prototype.hasOwnProperty.call(keys, field.$Name)) {
        const prefix = this.keys.length ? `${k}=` : ''
        const value = (keys as any)[k]
        _keys.push(`${prefix}${field.fromJson.toFilter(value)}`)
      } else {
        throw new Error(`Key field "${field.$Name}" not provided`)
      }
    }
    return `${this.name as string}(${_keys.join(',')})`
  }

  async readRecord(keys: KeysWithTypes<M, ET>) {
    const key = this.prepareRecordKey(keys)
    return this.getModel().readRecordByKey(key)
  }

  withKey(keys: KeysWithTypes<M, ET>) {
    const key = this.prepareRecordKey(keys)
    return new EntityRecord(this._m, this._typeName, key)
  }

  async query(params: TEntitySetQueryParams<M, ET>): Promise<TOdataReadResult<M['entityTypes'][ET]['record']>> {
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
  T extends keyof M['entityTypes'] = string,
> = {
  top?: number
  skip?: number
  filter?:
    | string
    | TODataFilters<M['entityTypes'][T]['fields']>[number]
    | TODataFilters<M['entityTypes'][T]['fields']>
  select?: M['entityTypes'][T]['fields'][]
  searchFocus?: M['entityTypes'][T]['fields']
  search?: string
  sorters?: TEntitySetSorter[]
  inlinecount?: 'allpages'
  expand?: string | EntityExpand<any, any> | EntityExpand<any, any>[]
  apply?: {
    filters?:
      | string
      | TODataFilters<M['entityTypes'][T]['fields']>[number]
      | TODataFilters<M['entityTypes'][T]['fields']>
    group?: {
      fields: M['entityTypes'][T]['fields'][]
      aggregate: M['entityTypes'][T]['measures'][]
    }
  }
}
