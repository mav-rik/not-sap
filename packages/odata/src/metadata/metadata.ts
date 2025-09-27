import { XMLParser } from 'fast-xml-parser'
import { EntitySet } from './entity-set'
import type { OData, TOdataDummyInterface } from '../odata'
import type { ODataEdmType } from './format-edm'
import { EntityType } from './entity-type'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '$',
  removeNSPrefix: true,
  attributeValueProcessor(attrName, attrValue, path) {
    if (attrName === 'value-list' && path === 'Edmx.DataServices.Schema.EntityType') {
      return attrValue === 'true'
    }
    if (['Precision', 'MaxLength'].includes(attrName)) {
      return Number(attrValue)
    }
    return [
      'Nullable',
      'creatable',
      'updatable',
      'deletable',
      'searchable',
      'pageable',
      'addressable',
      'filterable',
      'variable-scale',
    ].includes(attrName)
      ? attrValue === 'true'
      : attrValue
  },
  isArray(tagName) {
    return [
      'Include',
      'Parameter',
      'EntityType',
      'PropertyRef',
      'Property',
      'NavigationProperty',
      'ComplexType',
      'Association',
      'EntitySet',
      'AssociationSet',
      'FunctionImport',
      'End',
      'FunctionImport',
      'PropertyValue',
      'Annotations',
      'Annotation',
      'Record',
      'Parameters',
      'AllowedExpressions',
    ].includes(tagName)
  },
})

/**
 * Class representing the metadata of an OData service.
 *
 * @template M - A type extending TOdataDummyInterface, defaulting to TOdataDummyInterface.
 */
export class Metadata<M extends TOdataDummyInterface = TOdataDummyInterface> {
  protected _parsed: RawMetadata

  protected _types = new Map<
    string,
    TSchema['EntityType'][number]
  >()
  protected _complexTypes = new Map<
    string,
    TSchema['ComplexType'][number]
  >()
  protected _functionDefinitions = new Map<
    string,
    any // We'll define proper type later
  >()
  protected _assoc = new Map<
    string,
    TSchema['Association'][number]
  >()
  protected _namespacedSets = new Map<
    keyof M['entitySets'],
    Required<TSchema>['EntityContainer']['EntitySet'][number]
  >()
  protected _sets = new Map<
    keyof M['entitySets'],
    Required<TSchema>['EntityContainer']['EntitySet'][number]
  >()
  protected _assocSets = new Map<
    string,
    Required<TSchema>['EntityContainer']['AssociationSet'][number]
  >()
  protected _functions = new Map<
    string,
    Required<TSchema>['EntityContainer']['FunctionImport'][number]
  >()
  protected _annot = new Map<
    string,
    TSchema['Annotations'][number]['Annotation']
  >()

  constructor(
    xml: string,
    public readonly model: OData<M>,
    public readonly name?: string
  ) {
    this._parsed = parser.parse(xml)
    const schemas = [this._parsed.Edmx.DataServices.Schema].flat()
    for (const schema of schemas) {
      const ns = schema.$Namespace
      for (const node of schema.EntityType || []) {
        this._types.set(`${ns}.${node.$Name}`, node)
      }
      for (const node of schema.ComplexType || []) {
        this._complexTypes.set(`${ns}.${node.$Name}`, node)
      }
      // Parse V4 Function definitions
      for (const node of (schema as any).Function || []) {
        this._functionDefinitions.set(`${ns}.${node.$Name}`, node)
      }
      for (const node of schema.Association || []) {
        this._assoc.set(`${ns}.${node.$Name}`, node)
      }
      for (const node of schema.EntityContainer?.EntitySet || []) {
        this._namespacedSets.set(`${ns}.${node.$Name}` as keyof M['entitySets'], node)
        this._sets.set(node.$Name as keyof M['entitySets'], node)
      }
      for (const node of schema.EntityContainer?.AssociationSet || []) {
        this._assocSets.set(`${ns}.${node.$Name}`, node)
      }
      for (const node of schema.EntityContainer?.FunctionImport || []) {
        // Use just the FunctionImport name, not namespaced
        this._functions.set(node.$Name, node)
      }
      for (const node of schema.Annotations || []) {
        const target =
          node.$Target === this.getSelfContainerTargetV2(ns) ? 'SAP__self.Container' : node.$Target
        const a = this._annot.get(target)
        if (a) {
          const merged = [...[a].flat(), ...[node.Annotation].flat()]
          this._annot.set(target, merged)
        } else {
          this._annot.set(target, node.Annotation)
        }
      }
    }
  }

  getSelfContainerTargetV2(namespace: string) {
    return `${namespace}.${namespace}_Entities`
  }

  getRawEntityType(name: string) {
    return this._types.get(name)
  }
  getRawComplexType(name: string) {
    return this._complexTypes.get(name)
  }
  getRawEntitySet(name: keyof M['entitySets']) {
    return this._sets.get(name) || this._namespacedSets.get(name)
  }
  getRawAnnotations(target: string) {
    return this._annot.get(target)
  }
  getComplexTypesList() {
    return Array.from(this._complexTypes.keys())
  }
  getEntitySetsList(suppressNamespace = false) {
    return suppressNamespace ? Array.from(this._sets.keys()) : Array.from(this._namespacedSets.keys())
  }
  getFunctionsList() {
    return Array.from(this._functions.keys())
  }
  getRawFunction(name: string) {
    // First try to find by FunctionImport name (new approach)
    let functionImport = this._functions.get(name)

    // For backward compatibility, if not found and it looks like a fully qualified name,
    // try to find the FunctionImport that references this Function
    if (!functionImport && name.includes('.')) {
      // Search for a FunctionImport that references this Function name
      for (const [, importDef] of this._functions) {
        if ((importDef as any).$Function === name) {
          functionImport = importDef
          break
        }
      }
    }

    if (!functionImport) return undefined

    // For V4, get the actual Function definition which has the parameters
    if (this.isV4 && (functionImport as any).$Function) {
      const functionName = (functionImport as any).$Function
      const functionDef = this._functionDefinitions.get(functionName)
      if (functionDef) {
        // Return a combined object with both FunctionImport and Function info
        return {
          ...functionImport,
          Parameter: functionDef.Parameter || [],
          ReturnType: functionDef.ReturnType
        }
      }
    }

    // For V2/V3 or if no Function definition found, return the FunctionImport
    return functionImport
  }

  getRawAssociation(name: string) {
    return this._assoc.get(name)
  }

  protected _entitySetsMap = new Map<keyof M['entitySets'], EntitySet<M, keyof M['entitySets'], any>>()
  protected _entityTypesMap = new Map<keyof M['entityTypes'], EntityType<M, any>>()

  get isV4() {
    return this._parsed.Edmx.$Version === '4.0'
  }

  /**
   * Retrieves an EntitySet by its name. If the EntitySet is not already cached,
   * it creates a new EntitySet instance, caches it, and then returns it.
   *
   * @param name - The name of the EntitySet to retrieve.
   * @returns The EntitySet corresponding to the provided name.
   * @throws Will throw an error if the EntitySet does not exist in the metadata.
   */
  getEntitySet<T extends keyof M['entitySets']>(name: T): EntitySet<M, T, M['entitySets'][T]> {
    if (!this._sets.has(name) && !this._namespacedSets.has(name)) {
      throw new Error(`EntitySet "${name as string}" does not exist in metadata`)
    }
    let cached = this._entitySetsMap.get(name) as EntitySet<M, T, any>
    if (!cached) {
      cached = new EntitySet<M, T, M['entitySets'][T]>(this, name)
      this._entitySetsMap.set(name, cached)
    }
    return cached! as unknown as EntitySet<M, T, M['entitySets'][T]>
  }

  getEntityType<T extends keyof M['entityTypes']>(name: T) {
    if (!this._types.has(name as string)) {
      throw new Error(`EntityType "${name as string}" does not exist in metadata`)
    }
    let cached = this._entityTypesMap.get(name)
    if (!cached) {
      cached = new EntityType<M, T>(this, name)
      this._entityTypesMap.set(name as string, cached)
    }
    return cached as EntityType<M, T>
  }
}


export interface RawMetadataProperty<T extends PropertyKey = string> {
  '$Name': T
  '$Type': ODataEdmType
  '$Precision'?: number
  '$Scale'?: number
  '$variable-scale'?: boolean
  '$MaxLength'?: number
  '$display-format'?: 'UpperCase' | 'NonNegative' | 'Date'
  '$label'?: string
  '$unit'?: string
  '$semantics'?: TSAPSemantics
  '$quickinfo'?: string
  '$Nullable'?: boolean
  '$creatable'?: boolean
  '$updatable'?: boolean
  '$sortable'?: boolean
  '$filterable'?: boolean
  '$value-list'?: 'none' | 'fixed-values' | 'standard' | 'extended'

  // custom UI property annotations
  '$$description'?: string
}

export interface RawMetadataPropertyRef {
  $Name: string
}

export interface RawMetadataReferential {
  PropertyRef: RawMetadataPropertyRef[]
  $Role: string
}

export interface RawMetadataEnd {
  $Type: string
  $Multiplicity: string
  $Role: string
}
export interface RawMetadataSetEnd {
  $EntitySet: string
  $Role: string
}

export interface RawMetadataFunctionParameter {
  $Name: string
  $Type: string
  $Mode: string
  $MaxLength?: number
  $label?: string
}

export type RawMetadataPropertyType =
  | {
      $String: string
    }
  | {
      String: string
    }
  | {
      $Bool: string
    }
  | {
      $Path: string
    }
  | {
      $Int: string
    }
  | {
      $PropertyPath: string
    }
  | {
      Record: RawMetadataAnnotationRecord[]
    }
  | {
      Collection: RawMetadataPropertyType | ''
    }

export type RawMetadataPropertyValue = RawMetadataPropertyType & { $Property: string }

export interface RawMetadataAnnotationRecord {
  PropertyValue: RawMetadataPropertyValue[]
  $Type?:
    | 'Common.ValueListParameterIn'
    | 'Common.ValueListParameterOut'
    | 'Common.ValueListParameterInOut'
    | 'Common.ValueListParameterDisplayOnly'
}

export interface TSchema {
        'EntityType': {
          'Key': {
            PropertyRef: {
              $Name: string
            }[]
          }
          'Property': RawMetadataProperty[]
          'NavigationProperty'?: (
            | {
              // v2 format
              $Name: string
              $Relationship: string
              $FromRole: string
              $ToRole: string
            }
            | {
              // v4 format
              $Name: string
              $Type: string
              $Partner?: string
              $ContainsTarget?: boolean
            }
          )[]
          '$Name': string
          '$label'?: string
          '$value-list'?: boolean
          '$content-version'?: string
        }[]
        'ComplexType': {
          Property: RawMetadataProperty[]
          $Name: string
          $label?: string
        }[]
        'Association': {
          'End': [RawMetadataEnd, RawMetadataEnd]
          'ReferentialConstraint': {
            Principal: RawMetadataReferential
            Dependent: RawMetadataReferential
          }
          '$Name': string
          '$content-version'?: string
        }[]
        'EntityContainer'?: {
          'EntitySet': {
            '$Name': string
            '$EntityType': string
            '$creatable'?: boolean
            '$updatable'?: boolean
            '$deletable'?: boolean
            '$searchable'?: boolean
            '$pageable'?: boolean
            '$addressable'?: boolean
            '$content-version'?: string
          }[]
          'AssociationSet': {
            'End': [RawMetadataSetEnd, RawMetadataSetEnd]
            '$Name': string
            '$Association': string
            '$creatable'?: boolean
            '$updatable'?: boolean
            '$deletable'?: boolean
            '$content-version'?: string
          }[]
          'FunctionImport': {
            'Parameter': RawMetadataFunctionParameter[]
            '$Name': string
            '$ReturnType': string
            '$HttpMethod': string
            '$action-for'?: string
          }[]
          '$Name': string
          '$IsDefaultEntityContainer'?: string
          '$message-scope-supported'?: string
          '$supported-formats'?: string
        }
        'Annotations': {
          Annotation: (
            | (RawMetadataPropertyType & {
                $Term: 'Common.ValueList' | 'Common.ValueListReference'
              })
            | {
                $Term: 'Common.ValueList' | 'Common.ValueListReference'
              }
          )[]
          $Target: string
        }[]

        'link': {
          $rel: string
          $href: string
        }[]
        '$Namespace': string
        '$lang': string
        '$schema-version': string
      }

export interface RawMetadata {
  '?xml': {
    $version: string
    $encoding: string
  }
  'Edmx': {
    $Version: '2.0' | '4.0'

    Reference: {
      Include: {
        $Namespace: string
        $Alias: string
      }[]
      $Uri: string
    }[]
    DataServices: {
      Schema: TSchema | TSchema[]
      $DataServiceVersion: string
    }
  }
}
export type TSAPSemantics =
  | 'tel' // Telephone number
  | 'tel;type=cell,work' // Work cellphone number
  | 'tel;type=fax' // Fax number
  | 'email' // Email address
  | 'email;type=pref' // Preferred email address
  | 'url' // Web URL
  | 'name' // Formatted text of the full name
  | 'givenname' // First name or given name of a person
  | 'middlename' // Middle name of a person
  | 'familyname' // Last name or family name of a person
  | 'nickname' // Descriptive name given instead of or in addtion to the one marked as name
  | 'honorific' // Title of a person (Ph.D., Dr., ...)
  | 'suffix' // Suffix to the name of a person
  | 'note' // Supplemental information or a comment that is associated with the vCard
  | 'photo' // URL of a photo of a person
  | 'city' // Address: city
  | 'street' // Address: street
  | 'country' // Address: country
  | 'region' // Address: state or province
  | 'zip' // Address: postal code
  | 'pobox' // Address: post office box
  | 'org' // Organization name
  | 'org-unit' // Organizational unit
  | 'org-role' // Organizational role
  | 'title' // Job title
  | 'bday' // Birth date
  | 'summary' // Calendar: summary of a calendar component
  | 'description' // Calendar: description of a calendar component, detailing the summary
  | 'categories' // Calendar: comma-separated list of categories for a calendar component
  | 'dtstart' // Calendar: the date and time that a calendar component starts
  | 'dtend' // Calendar: the date and time that a calendar component ends
  | 'duration' // Calendar: duration as an alternative to dtend, see xs:duration
  | 'due' // Calendar: the date and time that a to-do is expected to be completed
  | 'completed' // Calendar: the date and time that a to-do was actually completed
  | 'priority' // Calendar: the relative priority for a calendar component, 0 for undefined, 1 for highest, ... 9 for lowest
  | 'class' // Calendar: access classification for a calendar component
  | 'status' // Calendar: overall status or confirmation for the calendar component
  | 'percent-complete' // Calendar: percent completion of a to-do., ranging from 0 to 100 (integer)
  | 'contact' // Calendar: contact information or alternatively a reference to contact information associated with the calendar component
  | 'location' // Calendar: the intended venue for the activity defined by a calendar component
  | 'transp' // Calendar: defines whether or not an event is transparaent to busy time searches
  | 'fbtype' // Calendar: free/busy time type, see iCalendar, Section 3.2.9
  | 'wholeday' // Calendar: true or false, depending on whether an event is scheduled for an entire day
  | 'year' // Calendar: year as string following the regex pattern (-?)YYYY(Y*) consisting of an optional minus sign for years B.C. followed by at least four digits
  | 'yearmonth' // Calendar: year and month as string following the regex pattern (-?)YYYY(Y*)MM consisting of an optional minus sign for years B.C. followed by at least six digits, the last two digits are a number between 01 and 12 representing the months January to December
  | 'yearmonthday' // Calendar: year, month and day as string following the logical pattern (-?)YYYY(Y*)MMDD consisting of an optional minus sign for years B.C. followed by at least eight digits, where the last four digits represent the months January to December (MM) and the day of the month (DD). The string matches the regex pattern -?([1-9][0-9]{3,}│0[0-9]{3})(0[1-9]│1[0-2])(0[1-9]│[12][0-9]│3[01]). The regex pattern does not reflect the additional constraint for "Day-of-month Values": The day value must be no more than 30 if month is one of 04, 06, 09, or 11, no more than 28 if month is 02 and year is not divisible by 4, or is divisible by 100 but not by 400, and no more than 29 if month is 02 and year is divisible by 400, or by 4 but not by 100
  | 'from' // Mail: author of message, see RFC5322, section 3.6.2
  | 'sender' // Mail: mailbox of agent responsible for actual transmission
  | 'to' // Mail: comma-separated list of primary recipients, see RFC5322, section 3.6.3
  | 'cc' // Mail: carbon copy, comma-separated
  | 'bcc' // Mail: blind carbon copy, comma-separated
  | 'subject' // Mail: topic of the message
  | 'body' // Mail: message body
  | 'keywords' // Mail: comma-separated list of important words and phrases that might be useful for the recipient
  | 'received' // Mail: DateTime the message was received
  | 'geo-lon' // Geolocation: longitude
  | 'geo-lat' // Geolocation: latitude
  | 'currency-code' // Currency code, preferably ISO
  | 'unit-of-measure' // Unit of measure, preferably ISO
  | 'count' // Aggregation: the number of unaggregated entities that have been aggregated into the response entity (count(*) in SQL). Only valid for one property of an entity type that is annotated with sap:semantics="aggregate".
