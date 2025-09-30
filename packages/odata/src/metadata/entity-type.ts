import type { Metadata, TSchema, RawMetadataProperty } from './metadata'
import { odataValueFormat, type ODataEdmType } from './format-edm'
import {
  odataFilterFormat,
  type TODataFilter,
  type TODataFilterAnd,
  type TODataFilterConditionType,
  type TODataFilterOr,
  type TODataFilters,
  type TODataFilterValWithType,
} from './format-filters'
import { getMetadataRefiner } from './refiner'
import { TODataParams, useModel, type TOdataDummyInterface } from '../odata'
import { convertAnnotations, type TPropertyAnnotations } from './annotations'
import { joinPath } from '../utils'
import { EntitySet, TEntitySetQueryParams } from './entity-set'
import { EntityExpand } from './entity-expand'

export type NavProperties<T extends PropertyKey = string> = NavProperty<T>[]

export type NavProperty<T extends PropertyKey = string> = RawMetadataProperty<T> & {
  toMany: boolean
}

/**
 * Represents an array of TEntityType objects, each corresponding to a field within an EntitySet.
 *
 * @template T - The type of the property key, defaulting to string.
 */
export type TEntityTypes<T extends PropertyKey = string> = TEntityType<T>[]

/**
 * Represents a field within an EntitySet, including metadata and methods for data transformation.
 *
 * @template T - The type of the property key, defaulting to string.
 */
export type TEntityType<T extends PropertyKey = string> = RawMetadataProperty<T> & {
  /**
   * has Edm.Decimal or other numeric type
   */
  isNumber: boolean
  /**
   * has Collection() type wrapper
   */
  isCollection: boolean
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

export class EntityType<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
> {
  protected _type: TSchema['EntityType'][number]
  protected _fields?: TEntityTypes<M['entityTypes'][T]['fields']>
  protected _navToMany?: NavProperties<keyof (M['entityTypes'][T]['navToMany'])>
  protected _navToOne?: NavProperties<keyof (M['entityTypes'][T]['navToOne'])>
  protected _keys?: M['entityTypes'][T]['keys'][]
  protected _fieldsMap?: Map<
    M['entityTypes'][T]['fields'],
    TEntityType<M['entityTypes'][T]['fields']>
  >
  protected _navsMap?: Map<
    keyof (M['entityTypes'][T]['navToMany'] | M['entityTypes'][T]['navToOne']),
    NavProperty<keyof (M['entityTypes'][T]['navToMany'] | M['entityTypes'][T]['navToOne'])>
  > 
  protected _selfAnnotContainer?: TPropertyAnnotations
  protected _selfAnnotContainerName?: TPropertyAnnotations
  protected _selfAnnotCommon?: TPropertyAnnotations
  public readonly entityTypeNS: string

  constructor(
    protected _m: Metadata<M>,
    protected _entityType: T
  ) {
    const {kind, definition} = _m.getType(_entityType as string)!
    if (kind === 'entity') {
      this._type = definition as TSchema['EntityType'][number]
    } else {
      throw new Error(`"${_entityType as string}" does not exist in metadata of the service "${_m.name}".`)
    }
    this.entityTypeNS = (_entityType as string).split('.').slice(0, -1).join('.')
  }

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
        this._m.getRawAnnotations('SAP__self.Container/' + (this.name as string))
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

  get name() {
    return this._entityType as string
  }

  getType() {
    return this._type
  }

  getLabel() {
    return (this._type.$label || this.selfAnnotCommon?.['SAP__common.Label'] || this.name) as
      | string
      | undefined
  }

  get keys() {
    if (!this._keys) {
      this._keys = this._type.Key.PropertyRef.map(k => k.$Name) as M['entityTypes'][T]['keys'][]
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
    field: M['entityTypes'][T]['fields'],
    data: Partial<Omit<RawMetadataProperty, '$Name'>>
  ) {
    return getMetadataRefiner().refineField(this._m.name || '', this.name as string, field, data)
  }

  get fields(): TEntityTypes<M['entityTypes'][T]['fields']> {
    if (!this._fields) {
      this._updateFields()
    }
    return this._fields!
  }

  private _updateNavProps() {
    this._navToMany = []
    this._navToOne = []
    this._navsMap = new Map()
    for (const np of this._type.NavigationProperty || []) {
      if (this._m.isV4) {
        // V4 format - check Type for Collection
        const navProp = np as {
          $Name: string
          $Type: string
          $Partner?: string
          $ContainsTarget?: boolean
        }
        const isCollection = navProp.$Type.startsWith('Collection(')
        const targetType = isCollection
          ? navProp.$Type.slice('Collection('.length, -1)
          : navProp.$Type

        const navProperty: NavProperty<keyof (M['entityTypes'][T]['navToMany'] | M['entityTypes'][T]['navToOne'])> = {
          $Name: navProp.$Name as keyof (M['entityTypes'][T]['navToMany'] | M['entityTypes'][T]['navToOne']),
          $Type: targetType as ODataEdmType,
          toMany: isCollection,
        }

        if (isCollection) {
          this._navToMany!.push(navProperty as NavProperty<keyof (M['entityTypes'][T]['navToMany'])>)
        } else {
          this._navToOne!.push(navProperty as NavProperty<keyof (M['entityTypes'][T]['navToOne'])>)
        }
        this._navsMap.set(navProperty.$Name, navProperty)
      } else {
        // V2 format - need to check Association
        const navProp = np as {
          $Name: string
          $Relationship: string
          $FromRole: string
          $ToRole: string
        }

        // Get the association from metadata
        const association = this._m.getRawAssociation(navProp.$Relationship)

        if (association) {
          // Find the target end based on ToRole
          const targetEnd = association.End.find(e => e.$Role === navProp.$ToRole)

          if (targetEnd) {
            const isToMany = targetEnd.$Multiplicity === '*' || targetEnd.$Multiplicity === '0..*'
            // const targetTypeName = targetEnd.$Type.split('.').pop() || targetEnd.$Type

            const navProperty: NavProperty<keyof (M['entityTypes'][T]['navToMany'] | M['entityTypes'][T]['navToOne'])> = {
              $Name: navProp.$Name as keyof (M['entityTypes'][T]['navToMany'] | M['entityTypes'][T]['navToOne']),
              $Type: targetEnd.$Type as ODataEdmType,
              toMany: isToMany,
            }

            if (isToMany) {
              this._navToMany!.push(navProperty as NavProperty<keyof (M['entityTypes'][T]['navToMany'])>)
            } else {
              this._navToOne!.push(navProperty as NavProperty<keyof (M['entityTypes'][T]['navToOne'])>)
            }
            this._navsMap.set(navProperty.$Name, navProperty)
          }
        }
      }
    }
  }

  get navToMany() {
    if (!this._navToMany) {
      this._updateNavProps()
    }
    return this._navToMany
  }
  get navToOne() {
    if (!this._navToOne) {
      this._updateNavProps()
    }
    return this._navToOne
  }

  private _updateFields() {
    const refiner = getMetadataRefiner()
    const fm = this._fieldsMap
    if (!this._fields) {
      refiner.subscribe(this._m.name || '', this.name as string, this._updateFields.bind(this))
    } else {
      this._fieldsMap = undefined
    }
    this._fields = this._type.Property.map(p => {
      const annotations =
        fm?.get(p.$Name)?.annotations ||
        convertAnnotations(this._m.getRawAnnotations(`${this.selfDataType}/${p.$Name}`))
      const v4Attrs = {} as TEntityType<M['entityTypes'][T]['fields']>
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
      // Check if the type is a Collection
      const isCollection = p.$Type.startsWith('Collection(')
      const actualType = isCollection
        ? p.$Type.slice('Collection('.length, -1) as ODataEdmType
        : p.$Type

      return {
        ...p,
        ...v4Attrs,
        $Type: actualType, // Store the actual type without Collection wrapper
        $label: p.$label ?? v4Attrs.$label ?? p.$Name,
        ...refiner.refinedField(this._m.name || '', this.name as string, p.$Name),
        isNumber: ['Edm.Decimal', 'Edm.Int8', 'Edm.Int16', 'Edm.Int32', 'Edm.Int64', 'Edm.Single', 'Edm.Double', 'Edm.Byte', 'Edm.SByte'].includes(actualType),
        isCollection,
        fromJson: {
          toFilter: odataValueFormat.toFilter[actualType],
          toDisplay: odataValueFormat.toDisplay[actualType],
        },
        fromRaw: {
          toJson: odataValueFormat.toJson[actualType],
          toFilter: (v: string) => {
            const jsonValue = odataValueFormat.toJson[actualType](v)
            return jsonValue === undefined ? '' : odataValueFormat.toFilter[actualType](jsonValue)
          },
          toDisplay: (v: string) => {
            const jsonValue = odataValueFormat.toJson[actualType](v)
            return jsonValue === undefined ? '' : odataValueFormat.toDisplay[actualType](jsonValue)
          },
        },
        annotations,
      } as TEntityType<M['entityTypes'][T]['fields']>
    })
  }

  get selfDataType() {
    return this._m.isV4 ? `SAP__self.${this._type.$Name}` : this._type.$Name
  }

  get fieldsMap(): Map<M['entityTypes'][T]['fields'], TEntityType> {
    if (!this._fieldsMap) {
      this._fieldsMap = new Map<
        M['entityTypes'][T]['fields'],
        TEntityType<M['entityTypes'][T]['fields']>
      >()
      for (const f of this.fields) {
        this._fieldsMap.set(
          f.$Name as unknown as M['entityTypes'][T]['fields'],
          f as unknown as TEntityType<M['entityTypes'][T]['fields']>
        )
      }
    }
    return this._fieldsMap
  }

  getNavsMap() {
    if (!this._navsMap) {
      this._updateNavProps()
    }
    return this._navsMap!
  }

  getField(name: M['entityTypes'][T]['fields']) {
    return this.fieldsMap.get(name)
  }

  hasValueHelp(field: M['entityTypes'][T]['fields']) {
    return (
      (this._m.isV4 && this.fieldsMap.get(field)?.annotations['SAP__common.ValueListReferences']) ||
      this.fieldsMap.get(field)?.annotations['Common.ValueList']?.CollectionPath
    )
  }

  getModel() {
    return this._m.model
  }

  /**
   * Value Help map
   */
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

  async getValueHelpEntitySet(field: M['entityTypes'][T]['fields']) {
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
                  )!
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
              any,
              any,
              any
            >
          )
        }
      })
    }
    return cached
  }


    /**
     * Prepares a query for an entity set based on the provided parameters.
     *
     * @param params - The query parameters for the entity set.
     * @returns An object containing the entity set name and the prepared OData query parameters.
     */
    prepareQuery(params: TEntitySetQueryParams<M, T>, expandPrefix?: string): {
      entitySet: T
      params: TODataParams
    } {
      const isV4 = this._m.isV4
      const select = [] as string[]
      for (const item of params.select || ([] as string[])) {
        const field = this.fieldsMap.get(item as M['entityTypes'][T]['fields'])
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

      const _expand = params.expand ? (typeof params.expand === 'string' ? params.expand
        : Array.isArray(params.expand) ? params.expand.map(e => e.render()) : [params.expand.render()]) : undefined
      
      const expand = typeof _expand === 'string' ? _expand : _expand ? _expand.map(e => e.expandString).join(',') : undefined
      let filter = params.filter ? this.renderFilter(params.filter, undefined, expandPrefix) || undefined : undefined
      const _select = select ?? [] as string[]

      if (!isV4 && Array.isArray(_expand)) {
        const filters = [
          filter,
          ..._expand.map(e => e.filterV2)
        ]
        filter = filters.filter(Boolean).map(f => `(${f})`).join(' and ')
        const s = _expand.filter(e => !!e.selectV2).map(e => e.selectV2!).flat()
        _select.push(...s)
      }
  
      const prefix = this.name
      return {
        entitySet: prefix as T,
        params: {
          '$top': params.top ?? 1000,
          '$skip': params.skip,
          '$filter': filter ? filter : undefined,
          '$select': _select.length ? Array.from(new Set(_select)).join(',') : undefined,
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
          '$expand': expand,
        },
      }
    }

  /**
   * Renders an OData filter string based on the provided filter object or string.
   *
   * @param filter - The filter to be rendered. It can be a string, a single filter object, or an array of filter objects.
   * @param joinWith - The logical operator to join multiple filters. It can be 'and' or 'or'. Default is 'and'.
   * @returns A string representing the rendered OData filter.
   */
  expand<NT extends (keyof M['entityTypes'][T]['navToMany'] | keyof M['entityTypes'][T]['navToOne'])>(
    navProp: NT,
    params?: TEntitySetQueryParams<M, NT extends keyof M['entityTypes'][T]['navToMany']
      ? M['entityTypes'][T]['navToMany'][NT]
      : M['entityTypes'][T]['navToOne'][NT]>,
  ) {
    const newEntityType = this.getNavsMap().get(navProp)?.$Type
    if (!newEntityType) {
      throw new Error(`${this.name} does not have nav property "${navProp as string}"`)
    }
    type newType = NT extends keyof M['entityTypes'][T]['navToMany']
      ? M['entityTypes'][T]['navToMany'][NT]
      : M['entityTypes'][T]['navToOne'][NT]

    return new EntityExpand<M, newType>(this._m, newEntityType as newType, { property: navProp as string, params })
  }

  renderFilter(
    filter:
      | string
      | TODataFilters<M['entityTypes'][T]['fields']>[number]
      | TODataFilters<M['entityTypes'][T]['fields']>,
    joinWith: 'and' | 'or' = 'and',
    expandPrefix?: string
  ): string {
    if (typeof filter === 'string') {
      return filter
    }
    const filters: TODataFilters<M['entityTypes'][T]['fields']> = Array.isArray(filter)
      ? filter
      : [filter]
    const rendered = filters
      .map(_f => {
        const f = _f as TODataFilterAnd<M['entityTypes'][T]['fields']> &
          TODataFilterOr<M['entityTypes'][T]['fields']> &
          TODataFilter<M['entityTypes'][T]['fields']>
        if (f.$and) {
          return this.renderFilter(f.$and, 'and', expandPrefix)
        }
        if (f.$or) {
          return this.renderFilter(f.$or, 'or', expandPrefix)
        }
        const fieldFilters = []
        for (const [field, val] of Object.entries(
          f as TODataFilter<M['entityTypes'][T]['fields']>
        )) {
          const typed: TODataFilterValWithType | undefined =
            typeof val === 'string'
              ? odataFilterFormat.fromString(val)
              : (val as TODataFilterValWithType)
          if (!typed) continue
          let type = Object.keys(typed)[0] as TODataFilterConditionType
          if (!odataFilterFormat.toFilter[type]) continue
          const v = typed[type as keyof typeof typed] as
            | string
            | number
            | boolean
            | [string | number | boolean]
            | [string, string]
            | [number, number]
          const v1 = Array.isArray(v) ? v[0] : v
          const v2 = Array.isArray(v) ? v[1] : v
          const meta = this.getField(field as M['entityTypes'][T]['fields'])

          if (type === 'contains' && !this._m.isV4) {
            type = 'substringof'
          }
          if (type === 'notContains' && !this._m.isV4) {
            type = 'notSubstringof'
          }

          // Add expandPrefix to field name if provided
          const fieldPath = expandPrefix ? `${expandPrefix}/${field}` : field

          // Special handling for empty/notEmpty on string fields
          if ((type === 'empty' || type === 'notEmpty') && meta && meta.$Type === 'Edm.String') {
            // For string fields, check both empty string and null
            if (type === 'empty') {
              fieldFilters.push(`(${fieldPath} eq '' or ${fieldPath} eq null)`)
            } else { // notEmpty
              fieldFilters.push(`(${fieldPath} ne '' and ${fieldPath} ne null)`)
            }
          } else if (meta) {
            fieldFilters.push(odataFilterFormat.toFilter[type](
              fieldPath,
              v1 === undefined ? v1 : meta.fromJson.toFilter(v1),
              v2 === undefined ? v2 : meta.fromJson.toFilter(v2)
            ))
          } else {
            fieldFilters.push(odataFilterFormat.toFilter[type](
              fieldPath,
              v1 === undefined ? `'${v1}'` : String(v1),
              v2 === undefined ? `'${v2}'` : String(v2)
            ))
          }
        }
        const joined = fieldFilters.join(' and ')
        return fieldFilters.length > 1 ? `(${joined})` : joined
      })
      .filter(Boolean)
      .join(` ${joinWith} `)
    return filters.length > 1 ? `(${rendered})` : rendered
  }
}

export interface TEntityCurrencyEntry {
  CurrencyCode: string
  ISOCode: string
  Text: string
  DecimalPlaces: number
}

let cachedCurrecies: Promise<Map<string, TEntityCurrencyEntry>> | undefined = undefined
