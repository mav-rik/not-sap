import { TOdataDummyInterface } from '../odata'
import { Metadata } from './metadata'
import { EntityWrapper } from './entity-wrapper'
import { TEntitySetQueryParams } from './entity-set'
import { EntityType } from './entity-type'


export type TExpandParams<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
  >  = Pick<TEntitySetQueryParams<M, T>, 'filter' | 'select' | 'top' | 'skip' | 'apply'>

interface ExpandSegment<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
  > {
  property: string
  params?: TEntitySetQueryParams<M, T>
  entityType: EntityType
}

export interface TEntityExpandRendered {
  expandString: string
  filterV2?: string
  selectV2?: string[]
}

export class EntityExpand<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
> extends EntityWrapper<M, T> {
  private segments: ExpandSegment[] = []

  constructor(
    m: Metadata<M>,
    entityType: T,
    newSegment: Omit<ExpandSegment<M, T>, 'entityType'>,
    previousSegments?: ExpandSegment[]
  ) {
    super(m, entityType)
    if (previousSegments) {
      this.segments = [...previousSegments]
    }
    const newSegmentWithType = newSegment as ExpandSegment
    newSegmentWithType.entityType = this._entityType as unknown as EntityType
    this.segments.push(newSegmentWithType)
  }

  override expand<NT extends (keyof M['entityTypes'][T]['navToMany'] | keyof M['entityTypes'][T]['navToOne'])>(
    navProp: NT,
    params?: TEntitySetQueryParams<M, NT extends keyof M['entityTypes'][T]['navToMany']
      ? M['entityTypes'][T]['navToMany'][NT]
      : M['entityTypes'][T]['navToOne'][NT]>
  ) {

    type newType = NT extends keyof M['entityTypes'][T]['navToMany']
      ? M['entityTypes'][T]['navToMany'][NT]
      : M['entityTypes'][T]['navToOne'][NT]

    const newEntityType = this.getNavsMap().get(navProp)?.$Type
    if (!newEntityType) {
      throw new Error(`${this.name} does not have nav property "${navProp as string}"`)
    }

    return new EntityExpand<M, newType>(
      this._m,
      newEntityType as newType,
      { property: navProp as string, params },
      this.segments
    )
  }

  render(): TEntityExpandRendered {
    return this._m.isV4 ? this._renderV4() : this._renderV2()
  }

  override toString(): string {
    const rendered = this.render()
    return rendered.expandString
  }

  protected _renderV4(): TEntityExpandRendered {
// #### V4
// * Expand can include query options in `(...)`.

//   ```
//   $expand=Order_Details($filter=Quantity gt 10;$select=ProductID;$expand=Product),Customer($select=Name)
//   ```
// * Supported inside `(...)`: `$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`.
// * This allows shaping related data per navigation property, not just at root.
// support params

    // example 1:
    // entitySet.expand('nav1').expand('nav2').expand('nav3')
    // must render expand string:
    // nav1($expand=nav2($expand=nav3))
    //
    // example 2:
    // entitySet.expand('nav1', { select: ['prop1', 'prop2'] }).expand('nav2', { filter: {id: '1'} }).expand('nav3')
    // must render expand string:
    // nav1($select=prop1,prop2;$expand=nav2($filter=id eq '1';$expand=nav3))

    const renderSegmentsRecursively = (segments: ExpandSegment[], startIdx = 0): string => {
      if (startIdx >= segments.length) return ''

      const segment = segments[startIdx]
      if (!segment) return ''

      const options: string[] = []

      // Add query options from params
      if (segment.params) {
        if (segment.params.filter) {
          // Use the entity type directly from the segment
          const et = segment.entityType
          options.push(`$filter=${et.renderFilter(segment.params.filter)}`)
        }

        if (segment.params.select) {
          const selectArr = Array.isArray(segment.params.select) ? segment.params.select : [segment.params.select]
          options.push(`$select=${selectArr.join(',')}`)
        }

        if (segment.params.top !== undefined) {
          options.push(`$top=${segment.params.top}`)
        }

        if (segment.params.skip !== undefined) {
          options.push(`$skip=${segment.params.skip}`)
        }

        if (segment.params.apply) {
          const apply = [] as string[]
          if (segment.params.apply.filters) {
            // Use the entity type directly from the segment
            const et = segment.entityType
            apply.push(`filter(${et.renderFilter(segment.params.apply.filters)})`)
          }
          if (segment.params.apply.group) {
            apply.push(
              `groupby((${segment.params.apply.group.fields.join(
                ','
              )}),aggregate(${segment.params.apply.group.aggregate.join(',')}))`
            )
          }
          if (apply.length > 0) {
            options.push(`$apply=${apply.join('/')}`)
          }
        }
      }

      // Check if there are more segments (nested expand)
      const nextSegments = renderSegmentsRecursively(segments, startIdx + 1)
      if (nextSegments) {
        options.push(`$expand=${nextSegments}`)
      }

      // Build the result
      let result = segment.property
      if (options.length > 0) {
        result += `(${options.join(';')})`
      }

      return result
    }

    const expandString = renderSegmentsRecursively(this.segments)

    return {
      expandString,
    }
  }

  protected _renderV2(): TEntityExpandRendered {
// #### V2
// * Comma-separated navigation property names.
//   ```
//   $expand=Order,Customer,Order_Details/Product
//   ```
// * No inline filters or options.
// * You can only filter at root using navigation paths:
//   ```
//   $filter=Customer/Country eq 'NL' and Order/OrderID eq 1
//   ```
// Do not support params, only support prefixed prop filters

    // Build the expand path
    const expandString = this.segments.map(s => s.property).join('/')

    // Build filter string for V2 if there are filters in any segment
    let filterV2: string | undefined
    const filterParts: string[] = []

    // Build select fields for V2 with navigation path prefixes
    let selectV2: string[] | undefined
    const selectFields: string[] = []

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i]
      if (!segment) continue

      // Build the navigation path prefix for this segment
      const pathPrefix = this.segments.slice(0, i + 1).map(s => s.property).join('/')

      if (segment.params?.filter) {
        // Use the entity type directly from the segment
        const et = segment.entityType
        const filterStr = et.renderFilter(segment.params.filter, 'and', pathPrefix)
        if (filterStr) {
          filterParts.push(filterStr)
        }
      }

      // Handle select params - prefix each selected field with the navigation path
      if (segment.params?.select) {
        const selectArr = Array.isArray(segment.params.select) ? segment.params.select : [segment.params.select]
        selectArr.forEach(field => {
          selectFields.push(`${pathPrefix}/${field}`)
        })
      }
    }

    if (filterParts.length > 0) {
      filterV2 = filterParts.join(' and ')
    }

    if (selectFields.length > 0) {
      selectV2 = selectFields
    }

    return {
      expandString,
      filterV2,
      selectV2
    }
  }
}