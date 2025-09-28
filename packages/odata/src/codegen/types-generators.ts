import { EntityType } from '../metadata/entity-type'
import type { Metadata } from '../metadata/metadata'
import {
  codeGen,
  type TCoGeClassDeclaration,
  type TCoGeCodeElement,
  type TCoGeInterfaceDeclaration,
} from './code-gen-utils'

export interface TGenerateEntitySetDefinition {
  name: string
  type: string
}
export interface TGenerateEntityTypeDefinition {
  type: string
  keysType: string
  measuresType: string
  name: string
  keys: string
  measures: string
  navToMany: Record<string, string>
  navToOne: Record<string, string>
  record: Record<string, unknown>
}

interface TEntityTypeConsts {
  keys: string
  fields: string
  measures: string
}
                            // namespace.entityType
type TModelConsts = Record<string, Record<string, TEntityTypeConsts>> 
type TModelTypes = Record<string, Record<string, TEntityTypeConsts>> 

const isPlainObject = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const mergeDeep = <T extends Record<string, any>>(target: T, source: Record<string, any>): T => {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key]
    if (isPlainObject(sourceValue)) {
      const targetValue = target[key]
      const nextTarget = isPlainObject(targetValue) ? targetValue : {}
      ;(target as any)[key] = nextTarget
      mergeDeep(nextTarget, sourceValue)
    } else {
      ;(target as any)[key] = sourceValue
    }
  }

  return target
}

/**
 * Maps an OData type to a TypeScript type
 * @param odataType The OData type (e.g., 'Edm.String', 'Trippin.Location')
 * @param opts Options including model alias and available complex types
 * @returns The TypeScript type as a string
 */
function mapODataTypeToTypeScript(
  odataType: string,
  opts: {
    modelAlias: string
    capitalizedAlias?: string
    complexTypesToGen?: Set<string>
    entityTypesToGen?: Set<string>
    enumTypesToGen?: Set<string>
    metadata?: Metadata<any>
  }
): string {
  const capitalizedAlias = opts.capitalizedAlias || capitalize(opts.modelAlias)

  switch (odataType) {
    case 'Edm.String':
    case 'Edm.Guid':
      return 'string'
    case 'Edm.Boolean':
      return 'boolean'
    case 'Edm.Decimal':
    case 'Edm.Int8':
    case 'Edm.Int16':
    case 'Edm.Int32':
    case 'Edm.Int64':
    case 'Edm.Single':
    case 'Edm.Double':
    case 'Edm.Byte':
    case 'Edm.SByte':
      return 'number'
    case 'Edm.DateTime':
    case 'Edm.DateTimeOffset':
    case 'Edm.Date':
      // Raw OData returns these as strings ("/Date(timestamp)/" or ISO strings)
      return 'string'
    case 'Edm.TimeOfDay':
    case 'Edm.Time':
    case 'Edm.Duration':
      return 'string'
    case 'Edm.Binary':
      return 'string' // Base64 encoded
    case 'Edm.GeographyPoint':
    case 'Edm.GeometryPoint':
      return 'any' // Geographic/Geometric types
    default:
      // Non-Edm type - could be ComplexType, EntityType or EnumType
      if (!odataType.includes('.')) {
        // Missing namespace, can't resolve
        return 'any'
      }

      // Try to identify what kind of type this is using metadata if available
      if (opts.metadata) {
        const complexType = opts.metadata.getRawComplexType(odataType)
        if (complexType) {
          // It's a ComplexType - add it to generation set
          opts.complexTypesToGen?.add(odataType)
          const modelType = `T${capitalizedAlias}OData`
          return `${modelType}['complexTypes']['${odataType}']`
        }

        const enumType = opts.metadata.getRawEnumType(odataType)
        if (enumType) {
          // It's an EnumType - add it to generation set
          opts.enumTypesToGen?.add(odataType)
          const modelType = `T${capitalizedAlias}OData`
          return `${modelType}['enumTypes']['${odataType}']`
        }

        try {
          const entityType = opts.metadata.getEntityType(odataType as any)
          if (entityType) {
            // It's an EntityType - add it to generation set
            opts.entityTypesToGen?.add(odataType)
            const modelType = `T${capitalizedAlias}OData`
            return `${modelType}['entityTypes']['${odataType}']['record']`
          }
        } catch {
          // Not an entity type
        }
      }

      // Fallback: check if already in sets
      if (opts.complexTypesToGen?.has(odataType)) {
        const modelType = `T${capitalizedAlias}OData`
        return `${modelType}['complexTypes']['${odataType}']`
      }
      // Check if it's an EntityType
      else if (opts.entityTypesToGen?.has(odataType)) {
        const modelType = `T${capitalizedAlias}OData`
        return `${modelType}['entityTypes']['${odataType}']['record']`
      } else {
        // It's an EnumType or unknown type
        return 'any'
      }
  }
}

export function generateEntityTypeTypes(
  d: EntityType<any>,
  opts: {
    modelAlias: string
    capitalizedAlias?: string
    complexTypesToGen?: Set<string>
    entityTypesToGen?: Set<string>
    enumTypesToGen?: Set<string>
    metadata?: Metadata<any>
  },
  isV4: boolean
): {
  consts: TModelConsts
  types: TModelTypes
  entity: TGenerateEntityTypeDefinition
} {
  const fieldNames = d.fields.map(field => field.$Name)
  const keys = d.keys
  const measures = d.fields.filter(f => f.isMeasure).map(field => field.$Name)
  const ns = d.entityTypeNS
  const typeName = d.name.split('.').pop()!
  const typeConsts = {} as TModelConsts[string][string]
  const typeTypes = {} as TModelTypes[string][string]
  const capitalizedAlias = opts.capitalizedAlias || capitalize(opts.modelAlias)

  typeConsts.fields = `[${fieldNames.map(name => JSON.stringify(name)).join(', ')}] as const`
  typeConsts.keys = `[${keys.map(name => JSON.stringify(name)).join(', ')}] as const`
  typeConsts.measures =  measures.length
      ? `[${measures.map(name => JSON.stringify(name)).join(', ')}] as const`
      : '[] as const',

  typeTypes.fields = `(typeof ${opts.modelAlias}Consts)[${JSON.stringify(ns)}][${JSON.stringify(typeName)}]["fields"][number]`
  typeTypes.keys = `(typeof ${opts.modelAlias}Consts)[${JSON.stringify(ns)}][${JSON.stringify(typeName)}]["keys"][number]`
  typeTypes.measures = `(typeof ${opts.modelAlias}Consts)[${JSON.stringify(ns)}][${JSON.stringify(typeName)}]["measures"][number]`

  

  const navToMany: TGenerateEntityTypeDefinition['navToMany'] = {}
  const navToOne: TGenerateEntityTypeDefinition['navToOne'] = {}

  for (const nav of Array.from(d.getNavsMap().values())) {
    const target = nav.toMany ? navToMany : navToOne
    target[nav.$Name as string] = JSON.stringify(nav.$Type)
  }

  const record = {} as TGenerateEntityTypeDefinition['record']

  for (const field of Array.from(d.fieldsMap.values())) {
    // Determine the TypeScript type based on OData type
    // Note: field.$Type already has the actual type extracted (Collection wrapper removed)
    let fieldType = mapODataTypeToTypeScript(field.$Type, opts)

    // Wrap in Array if it's a collection
    if (field.isCollection) {
      fieldType = `Array<${fieldType}>`
    }

    // Add field to record - use optional if field is nullable
    const fieldName = field.$Nullable !== false ? `${String(field.$Name)}?` : String(field.$Name)
    record[fieldName] = fieldType
  }

  // Add navigation properties as optional fields
  for (const nav of Array.from(d.getNavsMap().values())) {
    // Get the target entity type name
    const targetEntityType = `T${capitalizedAlias}OData['entityTypes']['${nav.$Type}']['record']`
    // Navigation properties are always optional
    const navName = `${String(nav.$Name)}?`
    if (nav.toMany) {
      // For to-many relationships, it's an array of the target entity type
      record[navName] = isV4 ? `Array<${targetEntityType}>` : `{ results: Array<${targetEntityType}> }`
    } else {
      // For to-one relationships, it's the target entity type or null
      record[navName] = `${targetEntityType} | null`
    }
  }

  return {
    consts: {
      [JSON.stringify(ns)]: {
        [JSON.stringify(typeName)]: typeConsts,
      },
    },
    types: {
      [JSON.stringify(ns)]: {
        [JSON.stringify(typeName)]: typeTypes,
      }
    },
    entity: {
      type: `T${capitalizedAlias}[${JSON.stringify(ns)}][${JSON.stringify(typeName)}]["fields"]`,
      keysType: `T${capitalizedAlias}[${JSON.stringify(ns)}][${JSON.stringify(typeName)}]["keys"]`,
      measuresType: `T${capitalizedAlias}[${JSON.stringify(ns)}][${JSON.stringify(typeName)}]["measures"]`,
      name: d.name,
      keys: keys.map(k => JSON.stringify(k)).join(' | '),
      measures: measures.map(k => JSON.stringify(k)).join(' | '),
      navToMany,
      navToOne,
      record,
    },
  }
}

/**
 * Options for generating model types in OData.
 *
 * @param alias Optional alias to use for the model instead of the default name.
 * @param odataUrl Optional URL to the OData service.
 * @param entitySets Specifies which entity sets to include in the generation. Can be an array of entity set names or objects with names and optional aliases, or '*' for all entity sets.
 */
export interface TGenerateModelOpts {
  host?: string
  path?: string
  headers?: Record<string, string>
  alias?: string
  entitySets?: string[]
}

/**
 * Generates TypeScript types and classes for the given OData model metadata.
 *
 * @param {Metadata<any>} m - The OData metadata object.
 * @param {TGenerateModelOpts} opts - Options for generating model types.
 * @returns {string} The generated TypeScript code as a string.
 *
 * This function processes the provided OData metadata and generates TypeScript
 * types and classes for the model and its entity sets. It creates constants,
 * interfaces, and classes that represent the OData model, including entity set
 * types, fields, and keys. The generated code is returned as a string.
 */
export function generateModelTypes(m: Metadata<any>, opts: TGenerateModelOpts): string {
  const serviceName = m.name!
  const modelAlias =  toSafeVariableName(opts.alias || serviceName)
  const cModelAlias = capitalize(modelAlias)
  const elements: TCoGeCodeElement[] = []

  // Exported constant for the model name
  // elements.push({
  //   type: 'const',
  //   name: `${modelAlias}Name`,
  //   value: JSON.stringify(m.name),
  //   exported: true,
  // })

  const entitySets: TGenerateEntitySetDefinition[] = []
  const entityTypes: TGenerateEntityTypeDefinition[] = []
  const entitiesToGen = (opts.entitySets ?? m.getEntitySetsList()) as string[]
  const entityTypesToGen = new Set<string>()
  const complexTypesToGen = new Set<string>()
  const enumTypesToGen = new Set<string>()

  for (const entitySetName of entitiesToGen) {
    const entitySet = m.getEntitySet(entitySetName)
    if (entitySet) {
      const entityTypeName = entitySet.typeName
      entityTypesToGen.add(entityTypeName)
      entitySets.push({
        name: entitySet.name,
        type: entityTypeName,
      })
    }
  }

  const modelConsts: TModelConsts = {}
  const modelTypes: TModelTypes = {}

  // Discovery phase 1: Process functions to find all referenced types FIRST
  for (const fName of m.getFunctionsList()) {
    const rawFunction = m.getRawFunction(fName)!

    // Discover types from parameters
    if (m.isV4) {
      const allParams = rawFunction.Parameter || []
      const isBoound = (rawFunction as any).$IsBound
      const relevantParams = isBoound && allParams.length > 0 ? allParams.slice(1) : allParams

      for (const p of relevantParams) {
        const paramType = (p as any).$Type
        if (paramType && !paramType.startsWith('Edm.') && paramType.includes('.')) {
          // Check if it's a ComplexType, EnumType or EntityType
          const complexType = m.getRawComplexType(paramType)
          if (complexType) {
            complexTypesToGen.add(paramType)
          } else {
            const enumType = m.getRawEnumType(paramType)
            if (enumType) {
              enumTypesToGen.add(paramType)
            } else {
              try {
                m.getEntityType(paramType as any)
                entityTypesToGen.add(paramType)
              } catch {
                // Not an entity type
              }
            }
          }
        }
      }

      // Discover types from return type
      const returnTypeInfo = (rawFunction as any).ReturnType
      if (returnTypeInfo) {
        const typeStr = returnTypeInfo.$Type || returnTypeInfo.Type
        if (typeStr) {
          const actualType = typeStr.startsWith('Collection(')
            ? typeStr.slice('Collection('.length, -1)
            : typeStr

          if (actualType && !actualType.startsWith('Edm.') && actualType.includes('.')) {
            const complexType = m.getRawComplexType(actualType)
            if (complexType) {
              complexTypesToGen.add(actualType)
            } else {
              const enumType = m.getRawEnumType(actualType)
              if (enumType) {
                enumTypesToGen.add(actualType)
              } else {
                try {
                  m.getEntityType(actualType as any)
                  entityTypesToGen.add(actualType)
                } catch {
                  // Not an entity type
                }
              }
            }
          }
        }
      }
    } else {
      // V2/V3
      const allParams = rawFunction.Parameter || []
      const inParams = allParams.filter((p: any) => !p.$Mode || p.$Mode === 'In')

      for (const p of inParams) {
        const paramType = (p as any).$Type
        if (paramType && !paramType.startsWith('Edm.') && paramType.includes('.')) {
          const complexType = m.getRawComplexType(paramType)
          if (complexType) {
            complexTypesToGen.add(paramType)
          } else {
            const enumType = m.getRawEnumType(paramType)
            if (enumType) {
              enumTypesToGen.add(paramType)
            } else {
              try {
                m.getEntityType(paramType as any)
                entityTypesToGen.add(paramType)
              } catch {
                // Not an entity type
              }
            }
          }
        }
      }

      // Discover types from return type
      const returnTypeStr = (rawFunction as any).$ReturnType || (rawFunction as any).ReturnType
      if (returnTypeStr) {
        const actualType = returnTypeStr.startsWith('Collection(')
          ? returnTypeStr.slice('Collection('.length, -1)
          : returnTypeStr

        if (actualType && !actualType.startsWith('Edm.') && actualType.includes('.')) {
          const complexType = m.getRawComplexType(actualType)
          if (complexType) {
            complexTypesToGen.add(actualType)
          } else {
            const enumType = m.getRawEnumType(actualType)
            if (enumType) {
              enumTypesToGen.add(actualType)
            } else {
              try {
                m.getEntityType(actualType as any)
                entityTypesToGen.add(actualType)
              } catch {
                // Not an entity type
              }
            }
          }
        }
      }
    }
  }

  // Discovery phase 2: Recursively discover all entity types through navigation properties
  const processedTypes = new Set<string>()
  const toProcess = Array.from(entityTypesToGen)

  while (toProcess.length > 0) {
    const currentType = toProcess.pop()!
    if (processedTypes.has(currentType)) continue

    processedTypes.add(currentType)
    const entityType = m.getEntityType(currentType)

    // Add all navigation target types to be processed
    Array.from(entityType.getNavsMap().values()).forEach(nav => {
      const targetType = nav.$Type
      if (!processedTypes.has(targetType) && !entityTypesToGen.has(targetType)) {
        entityTypesToGen.add(targetType)
        toProcess.push(targetType)
      }
    })
  }

  for (const et of Array.from(entityTypesToGen)) {
    const entityType = m.getEntityType(et)

    // Discover ComplexTypes used by this entity type
    for (const field of entityType.fields) {
      // Check if the field type is not an Edm type (it's a ComplexType or EnumType)
      if (!field.$Type.startsWith('Edm.') && !field.$Type.includes('.')) {
        // Might be missing namespace, skip
        continue
      }
      if (!field.$Type.startsWith('Edm.')) {
        // Check if it's a ComplexType
        const complexType = m.getRawComplexType(field.$Type)
        if (complexType) {
          complexTypesToGen.add(field.$Type)
        } else {
          // Check if it's an EnumType
          const enumType = m.getRawEnumType(field.$Type)
          if (enumType) {
            enumTypesToGen.add(field.$Type)
          }
        }
      }
    }

    const { entity, consts, types } = generateEntityTypeTypes(entityType, {
      modelAlias,
      capitalizedAlias: cModelAlias,
      complexTypesToGen,
      entityTypesToGen,
      enumTypesToGen,
      metadata: m
    }, m.isV4)
    mergeDeep(modelConsts, consts)
    mergeDeep(modelTypes, types)

    entityTypes.push({
      type: entity.type,
      keysType: entity.keysType,
      measuresType: entity.measuresType,
      name: entity.name,
      keys: entity.keys,
      measures: entity.measures,
      navToMany: entity.navToMany,
      navToOne: entity.navToOne,
      record: entity.record,
    })
  }

  elements.push({
    type: 'const',
    name: modelAlias + "Consts",
    value: {
      type: 'deepObject',
      value: modelConsts
    },
    exported: true,
    jsDocs: ['Fields and Keys as Constants', '', `Model: ${modelAlias}`]
  })

  elements.push({
    type: 'interface',
    name: 'T' + cModelAlias,
    value: modelTypes,
    exported: true,
    jsDocs: ['Types for Keys and Fields', '', `Model: ${modelAlias}`]
  })

  const modelType = `T${cModelAlias}OData`

  // Recursively discover nested ComplexTypes
  const processedComplexTypes = new Set<string>()
  const complexTypesToProcess = Array.from(complexTypesToGen)

  while (complexTypesToProcess.length > 0) {
    const ctName = complexTypesToProcess.pop()!
    if (processedComplexTypes.has(ctName)) continue

    processedComplexTypes.add(ctName)
    const complexType = m.getRawComplexType(ctName)
    if (!complexType) continue

    // Check for nested ComplexTypes
    for (const property of complexType.Property || []) {
      const actualType = property.$Type.startsWith('Collection(')
        ? property.$Type.slice('Collection('.length, -1)
        : property.$Type

      if (!actualType.startsWith('Edm.') && actualType.includes('.')) {
        const nestedCT = m.getRawComplexType(actualType)
        if (nestedCT && !processedComplexTypes.has(actualType)) {
          complexTypesToGen.add(actualType)
          complexTypesToProcess.push(actualType)
        } else {
          // Check if it's an EnumType
          const enumType = m.getRawEnumType(actualType)
          if (enumType) {
            enumTypesToGen.add(actualType)
          }
        }
      }
    }
  }

  // Process EnumTypes to generate their types
  const enumTypes: Record<string, string> = {}
  for (const etName of Array.from(enumTypesToGen)) {
    const enumType = m.getRawEnumType(etName)
    if (!enumType) continue

    // Generate a union type of string literals for the enum
    const members = (enumType.Member || []).map(member => `'${member.$Name}'`)
    enumTypes[`'${etName}'`] = members.join(' | ') || 'never'
  }

  // Process ComplexTypes to generate their interfaces
  const complexTypes: Record<string, Record<string, unknown>> = {}
  for (const ctName of Array.from(complexTypesToGen)) {
    const complexType = m.getRawComplexType(ctName)
    if (!complexType) continue

    const ctRecord: Record<string, string> = {}
    for (const property of complexType.Property || []) {
      // Check if the property type is a collection
      const isCollection = property.$Type.startsWith('Collection(')
      const actualType = isCollection
        ? property.$Type.slice('Collection('.length, -1)
        : property.$Type

      // Determine the TypeScript type using the helper function
      let tsType = mapODataTypeToTypeScript(actualType, {
        modelAlias,
        capitalizedAlias: cModelAlias,
        complexTypesToGen,
        entityTypesToGen,
        enumTypesToGen,
        metadata: m
      })

      // Wrap in Array if it's a collection
      if (isCollection) {
        tsType = `Array<${tsType}>`
      }

      // Add field to record - use optional if field is nullable
      const fieldName = property.$Nullable !== false ? `${property.$Name}?` : property.$Name
      ctRecord[fieldName] = tsType
    }

    complexTypes[`'${ctName}'`] = ctRecord
  }

  const modelInterface: TCoGeInterfaceDeclaration = {
    type: 'interface',
    name: modelType,
    exported: true,
    extends: ['TOdataDummyInterface'],
    value: {
      entitySets: {},
      entityTypes: {},
      complexTypes: complexTypes,
      enumTypes: enumTypes,
      functions: {},
    },
    jsDocs: ['Main OData Interface', '', `Model: ${modelAlias}`]
  }

  for (const entityType of entityTypes) {
    modelInterface.value['entityTypes'][`'${entityType.name}'`] = {
      keys: entityType.keysType,
      fields: entityType.type,
      measures: entityType.measuresType,
      navToMany: entityType.navToMany,
      navToOne: entityType.navToOne,
      record: entityType.record,
    }
  }

  for (const entitySet of entitySets) {
    modelInterface.value['entitySets'][`'${entitySet.name}'`] = JSON.stringify(entitySet.type)
  }

  for (const fName of m.getFunctionsList()) {
    const rawFunction = m.getRawFunction(fName)!
    let params: string | Record<string, string> = 'never'
    let returnType: string = 'void'

    if (m.isV4) {
      // V4: Parameters don't have $Mode
      // For bound functions, skip the first parameter (binding parameter)
      const allParams = rawFunction.Parameter || []
      const isBoound = (rawFunction as any).$IsBound
      const relevantParams = isBoound && allParams.length > 0 ? allParams.slice(1) : allParams

      if (relevantParams.length > 0) {
        // Generate object type with parameter names and types
        const paramObj: Record<string, string> = {}
        for (const p of relevantParams) {
          const paramType = mapODataTypeToTypeScript((p as any).$Type || 'Edm.String', {
            modelAlias,
            capitalizedAlias: cModelAlias,
            complexTypesToGen,
            entityTypesToGen,
            enumTypesToGen,
            metadata: m
          })
          const nullable = (p as any).$Nullable !== 'false'
          paramObj[(p as any).$Name] = nullable && paramType !== 'string' ? `${paramType} | null` : paramType
        }
        params = paramObj
      }

      // Handle return type for V4
      if ((rawFunction as any).ReturnType) {
        const returnTypeInfo = (rawFunction as any).ReturnType
        const typeStr = returnTypeInfo.$Type || returnTypeInfo.Type

        if (typeStr) {
          // Check if it's a collection
          const isCollection = typeStr.startsWith('Collection(')
          const actualType = isCollection
            ? typeStr.slice('Collection('.length, -1)
            : typeStr

          const mappedType = mapODataTypeToTypeScript(actualType, {
            modelAlias,
            capitalizedAlias: cModelAlias,
            complexTypesToGen,
            entityTypesToGen,
            enumTypesToGen,
            metadata: m
          })

          returnType = isCollection ? `Array<${mappedType}>` : mappedType

          // Check for nullable
          const nullable = returnTypeInfo.$Nullable !== 'false'
          if (nullable && returnType !== 'string' && !isCollection) {
            returnType = `${returnType} | null`
          }
        }
      }
    } else {
      // V2/V3: Parameters may or may not have $Mode
      // If $Mode exists, filter by 'In', otherwise include all parameters
      const allParams = rawFunction.Parameter || []
      const inParams = allParams.filter((p: any) => !p.$Mode || p.$Mode === 'In')

      if (inParams.length > 0) {
        const paramObj: Record<string, string> = {}
        for (const p of inParams) {
          const paramType = mapODataTypeToTypeScript((p as any).$Type || 'Edm.String', {
            modelAlias,
            capitalizedAlias: cModelAlias,
            complexTypesToGen,
            entityTypesToGen,
            enumTypesToGen,
            metadata: m
          })
          const nullable = (p as any).$Nullable !== 'false'
          paramObj[(p as any).$Name] = nullable && paramType !== 'string' ? `${paramType} | null` : paramType
        }
        params = paramObj
      }

      // V2/V3 functions have $ReturnType on FunctionImport (with $ prefix)
      const returnTypeStr = (rawFunction as any).$ReturnType || (rawFunction as any).ReturnType
      if (returnTypeStr) {
        // Check if it's a collection
        const isCollection = returnTypeStr.startsWith('Collection(')
        const actualType = isCollection
          ? returnTypeStr.slice('Collection('.length, -1)
          : returnTypeStr

        const mappedType = mapODataTypeToTypeScript(actualType, {
          modelAlias,
          capitalizedAlias: cModelAlias,
          complexTypesToGen,
          entityTypesToGen
        })

        returnType = isCollection ? `Array<${mappedType}>` : mappedType

        // V2 return types don't typically have nullable info, so we don't add | null
      }
    }

    // Quote the function name to handle dots and other special characters
    modelInterface.value['functions'][`'${fName}'`] = { params, returnType }
  }

  elements.push(modelInterface)

  const modelClass: TCoGeClassDeclaration = {
    jsDocs: ['oData class', '', `Model: ${cModelAlias}`, '', '@example', `const model = ${cModelAlias}.getInstance()`],
    type: 'class',
    name: cModelAlias,
    exported: true,
    extends: `OData<${modelType}>`,
    props: [
      {
        name: 'readonly serviceName',
        static: true,
        visibility: 'public',
        value: `${JSON.stringify(serviceName)} as const`,
      },
      {
        name: 'instance?',
        static: true,
        visibility: 'private',
        type: cModelAlias,
      },
    ],
    methods: [
      {
        name: 'getInstance',
        visibility: 'public',
        static: true,
        args: {},
        body: [
          `if (!${cModelAlias}.instance) {`,
          `  ${cModelAlias}.instance = new ${cModelAlias}()`,
          `}`,
          `return ${cModelAlias}.instance`,
        ],
      },
  // public static async entitySet<T extends keyof THanaV4ParamOData['entitySets']>(name: T) {
  //   const instance = await HanaV4Param.getInstance()
  //   return instance.entitySet<T>(name)
  // }      
      {
        name: `async entitySet<T extends keyof T${cModelAlias}OData['entitySets']>`,
        visibility: 'public',
        static: true,
        args: {
          name: 'T',
        },
        body: [
          `const instance = ${cModelAlias}.getInstance()`,
          `return instance.entitySet<T>(name)`,
        ]
      },
      {
        name: 'constructor',
        visibility: 'private',
        args: {
          'opts?': 'TODataOptions',
        },
        body: [
          `super(${JSON.stringify(serviceName)}, {...opts, path: ${JSON.stringify(opts.path)}})`,
        ],
      },
    ],
  }

  elements.push(modelClass)

  const code = codeGen(elements)
  return code
}



/**
 * Transforms a service name to be safe for TypeScript variable names.
 * Converts kebab-case, snake_case, or other formats to camelCase.
 *
 * @param name - The original service name
 * @returns The transformed name safe for TypeScript variables
 *
 * @example
 * toSafeVariableName('my-service') // returns 'myService'
 * toSafeVariableName('my_service') // returns 'myService'
 * toSafeVariableName('my-service-2') // returns 'myService2'
 * toSafeVariableName('123service') // returns '_123service'
 */
export function toSafeVariableName(name: string): string {
  // If name starts with a number, prefix with underscore
  if (/^\d/.test(name)) {
    name = '_' + name;
  }

  // Replace special characters and convert to camelCase
  return name
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/[^a-zA-Z0-9$_]/g, '') // Remove any remaining invalid characters
    .replace(/^(.)/, (char) => char.toLowerCase()); // Ensure first character is lowercase
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 *
 * @example
 * capitalize('hello') // returns 'Hello'
 * capitalize('myService') // returns 'MyService'
 */
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}