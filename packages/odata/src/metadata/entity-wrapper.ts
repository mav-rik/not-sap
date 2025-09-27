import { TOdataDummyInterface, TODataParams } from "notsapodata/odata";
import { Metadata } from "./metadata";
import { EntityType } from "./entity-type";
import { EntityExpand } from "./entity-expand";
import { TEntitySetQueryParams } from "./entity-set";

export class EntityWrapper<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entityTypes'] = string,
>  {

    protected _entityType: EntityType<M, T>

    constructor(
        protected _m: Metadata<M>,
        protected _typeName: T
    ) {
        this._entityType = _m.getEntityType(_typeName)
    }

    getEntityType() {
        return this._entityType
    }

    get name() {
        return this._typeName as string
    }

    getType() {
        return this._entityType.getType()
    }

    getLabel() {
        return this._entityType.getLabel()
    }

    get keys() {
        return this._entityType.keys
    }

    get fields() {
        return this._entityType.fields
    }

    get fieldsMap() {
        return this._entityType.fieldsMap
    }

    getField(name: M['entityTypes'][T]['fields']) {
        return this._entityType.getField(name)
    }

    get navToMany() {
        return this._entityType.navToMany
    }

    get navToOne() {
        return this._entityType.navToOne
    }

    getNavsMap() {
        return this._entityType.getNavsMap()
    }

    refineField(
        field: M['entityTypes'][T]['fields'],
        data: Parameters<EntityType<M, T>['refineField']>[1]
    ) {
        return this._entityType.refineField(field, data)
    }

    hasValueHelp(field: M['entityTypes'][T]['fields']) {
        return this._entityType.hasValueHelp(field)
    }

    async getValueHelpEntitySet(field: M['entityTypes'][T]['fields']) {
        return this._entityType.getValueHelpEntitySet(field)
    }

    renderFilter(
        filter: Parameters<EntityType<M, T>['renderFilter']>[0],
        joinWith?: Parameters<EntityType<M, T>['renderFilter']>[1]
    ) {
        return this._entityType.renderFilter(filter, joinWith)
    }

    get selfAnnotContainer() {
        return this._entityType.selfAnnotContainer
    }

    get selfAnnotContainerName() {
        return this._entityType.selfAnnotContainerName
    }

    get selfAnnotCommon() {
        return this._entityType.selfAnnotCommon
    }

    async getCurreciesEntitySet() {
        return this._entityType.getCurreciesEntitySet()
    }

    async readCurrencies() {
        return this._entityType.readCurrencies()
    }

    getModel() {
        return this._entityType.getModel()
    }

    expand<NT extends (keyof M['entityTypes'][T]['navToMany'] | keyof M['entityTypes'][T]['navToOne'])>(
        navProp: NT,
        params?: TEntitySetQueryParams<M, NT extends keyof M['entityTypes'][T]['navToMany']
      ? M['entityTypes'][T]['navToMany'][NT]
      : M['entityTypes'][T]['navToOne'][NT]>,
    ) {
        type newType = NT extends keyof M['entityTypes'][T]['navToMany']
            ? M['entityTypes'][T]['navToMany'][NT]
            : M['entityTypes'][T]['navToOne'][NT]
  
        return this._entityType.expand(navProp, params) as EntityExpand<M, newType>
    }

    prepareQuery(params: TEntitySetQueryParams<M, T>): {
        entitySet: T
        params: TODataParams
    } {
        const result = this._entityType.prepareQuery(params)
        result.entitySet = this.name as T
        return result
    }

}