import { TOdataDummyInterface } from '../odata'
import { Metadata } from './metadata'
import { EntityWrapper } from './entity-wrapper'

type KeysWithTypes<
  M extends TOdataDummyInterface,
  ET extends keyof M['entityTypes']
> = Pick<M['entityTypes'][ET]['record'], M['entityTypes'][ET]['keys']>

interface ExpandSegment {
  property: string
  key?: string
}

export class EntityExpand<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
> extends EntityWrapper<M, T> {
  private segments: ExpandSegment[] = []

  constructor(
    m: Metadata<M>,
    entityType: T,
    initialProperty?: string,
    previousSegments?: ExpandSegment[]
  ) {
    super(m, entityType)
    if (previousSegments) {
      this.segments = [...previousSegments]
    }
    if (initialProperty) {
      this.segments.push({ property: initialProperty })
    }
  }

  override expand<NT extends (keyof M['entityTypes'][T]['navToMany'] | keyof M['entityTypes'][T]['navToOne'])>(
    navProp: NT
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
      navProp as string,
      this.segments
    )
  }

  override toString(): string {
    return this.segments
      .map(segment => {
        if (segment.key) {
          return `${segment.property}(${segment.key})`
        }
        return segment.property
      })
      .join('/')
  }
}