import { TOdataDummyInterface } from "notsapodata/odata";
import { Metadata } from "./metadata";
import { EntityType } from "./entity-type";
import { EntitySet } from "./entity-set";

export class EntityRecord<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
> extends EntityType<M, T> {
    constructor(
        m: Metadata<M>,
        entityType: T,
        protected prefix: string
    ) {
        super(m, entityType)
    }

    read() {
        return this.getModel().readRecordByKey(this.prefix)
    }
    
    toMany<NT extends keyof M['entityTypes'][T]['navToMany']>(navProp: NT) {
        const navTo = this.getNavsMap().get(navProp)
        if (!navTo) {
            throw new Error(`Navigation property "${navProp as string}" does not exist in ${this.prefix}`)
        }
        if (!navTo.toMany) {
            throw new Error(`Navigation property "${navProp as string}" cardinality is TO ONE`)
        }
        return new EntitySet<M, any, M['entityTypes'][T]['navToMany'][NT]>(this._m, {
            prefix: `${this.prefix}/${navProp as string}`,
            entityTypeName: this.getNavsMap().get(navProp)?.$Type || '',
        })        
    }
    
    toOne <NT extends keyof M['entityTypes'][T]['navToOne']>(navProp: NT) {
        const navTo = this.getNavsMap().get(navProp)
        if (!navTo) {
            throw new Error(`Navigation property "${navProp as string}" does not exist in ${this.prefix}`)
        }
        if (navTo.toMany) {
            throw new Error(`Navigation property "${navProp as string}" cardinality is TO MANY`)
        }
        return new EntityRecord<M, M['entityTypes'][T]['navToOne'][NT]>(this._m, navTo.$Type as M['entityTypes'][T]['navToOne'][NT], `${this.prefix}/${navProp as string}`)
    }
}
