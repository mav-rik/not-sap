import type { RawMetadata, RawMetadataAnnotationRecord, RawMetadataPropertyType } from './metadata'

/**
 * Converts a list of raw metadata annotations into a structured object.
 *
 * @param {RawMetadata['Edmx']['DataServices']['Schema']['Annotations'][number]['Annotation']} [annotations] - The list of raw metadata annotations to convert.
 * @returns {TPropertyAnnotations} The structured object representing the annotations.
 */
export function convertAnnotations(
  annotations?: RawMetadata['Edmx']['DataServices']['Schema']['Annotations'][number]['Annotation']
) {
  if (!annotations) {
    return {}
  }
  const obj = {} as Record<string, unknown>
  annotations.forEach(a => (obj[a.$Term] = processType(a)))
  return obj as TPropertyAnnotations
}

function processType(
  t: RawMetadataPropertyType | { $Term: string }
):
  | Record<string, unknown>
  | string
  | number
  | boolean
  | Record<string, unknown>[]
  | string[]
  | number[]
  | boolean[] {
  if ((t as { $String: string }).$String) {
    return (t as { $String: string }).$String
  }
  if ((t as { String: string }).String) {
    return (t as { String: string }).String
  }
  if ((t as { $Bool: string }).$Bool) {
    return (t as { $Bool: string }).$Bool === 'true'
  }
  if ((t as { $Path: string }).$Path) {
    return (t as { $Path: string }).$Path
  }
  if ((t as { $PropertyPath: string }).$PropertyPath) {
    return (t as { $PropertyPath: string }).$PropertyPath
  }
  if ((t as { $Int: string }).$Int) {
    return Number((t as { $Int: string }).$Int)
  }
  if ((t as { Record: RawMetadataAnnotationRecord[] }).Record) {
    return processRecord((t as { Record: RawMetadataAnnotationRecord[] }).Record)
  }
  if ((t as { Collection: RawMetadataPropertyType }).Collection) {
    const col = (t as { Collection: RawMetadataPropertyType }).Collection
    if ((col as { Record: RawMetadataAnnotationRecord[] }).Record) {
      return (col as { Record: RawMetadataAnnotationRecord[] }).Record.map(r =>
        processType({ Record: [r] })
      ) as string[]
    }
    return processType(col)
  }

  return t
}

function processRecord(r: RawMetadataAnnotationRecord[]): Record<string, unknown> {
  const obj = {} as Record<string, unknown>

  for (const prop of r[0].PropertyValue) {
    obj[prop.$Property] = processType(prop)
  }
  if (r[0].$Type) {
    obj.$Type = r[0].$Type
  }
  return obj
}

export interface TValueListAnnotation {
  CollectionPath: string
  Label?: string
  Parameters: {
    $Type:
      | 'Common.ValueListParameterIn'
      | 'Common.ValueListParameterOut'
      | 'Common.ValueListParameterInOut'
      | 'Common.ValueListParameterDisplayOnly'
      | 'SAP__common.ValueListParameterIn'
      | 'SAP__common.ValueListParameterOut'
      | 'SAP__common.ValueListParameterInOut'
      | 'SAP__common.ValueListParameterDisplayOnly'
    LocalDataProperty?: string
    ValueListProperty: string
    Constant?: string
  }[]
  SearchSupported?: boolean
}

export interface TPropertyAnnotations {
  // v2
  'Common.ValueList'?: TValueListAnnotation

  // v4
  'SAP__common.Heading'?: string
  'SAP__common.Label'?: string
  'SAP__measures.ISOCurrency'?: string
  'SAP__common.QuickInfo'?: string
  'SAP__common.IsCurrency'?: { $Term: 'SAP__common.IsCurrency' }
  'SAP__common.IsUpperCase'?: { $Term: 'SAP__common.IsUpperCase' }
  'SAP__aggregation.CustomAggregate'?: string
  'SAP__common.ValueListReferences'?: string
  // parent valuelist mapping
  'SAP__common.ValueListMapping'?: TValueListAnnotation

  // SAP__self.Container
  'SAP__CodeList.CurrencyCodes'?: {
    CollectionPath: string
    Url: string
  }
  'SAP__aggregation.ApplySupported'?: {
    Transformations: string[]
    Rollup: { $Property: string; $EnumMember: string }
  }[]
  'SAP__common.ApplyMultiUnitBehaviorForSortingAndFiltering'?: boolean
  'SAP__capabilities.FilterFunctions'?: string[]

  // SAP__self.Container/{name}
  'SAP__capabilities.SearchRestrictions'?: { Searchable: boolean }
  'SAP__capabilities.InsertRestrictions'?: { Insertable: boolean }
  'SAP__capabilities.DeleteRestrictions'?: { Deletable: boolean }
  'SAP__capabilities.UpdateRestrictions'?: {
    Updatable: boolean
    QueryOptions?: { SelectSupported?: boolean }
  }
  'SAP__capabilities.FilterRestrictions'?: {
    FilterExpressionRestrictions?: { Property: string; AllowedExpressions: string[] }[]
  }
  'SAP__core.OptimisticConcurrency'?: { Collection: string }

  // SAP__self.Container/{name}Type
  'SAP__UI.Facets'?: { Label?: string; ID?: string }[]
  'SAP__UI.HeaderInfo'?: { TypeName: string; TypeNamePlural?: string }
  'SAP__UI.Identification'?: { Label: string; Value: string; $Type: 'SAP__UI.DataField' }[]
  'SAP__UI.LineItem'?: { Label: string; Value: string; $Type: 'SAP__UI.DataField' }[]
  'SAP__UI.SelectionFields'?: { PropertyPath: string[] }
}
