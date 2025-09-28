import { EntityType } from '../metadata/entity-type'
import type { Metadata, TSchema } from '../metadata/metadata'
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

const typeKindMap = {
  complex: 'complexTypes',
  entity: 'entityTypes',
  enum: 'enumTypes',
}

const typeKindMapEnd = {
  complex: '',
  entity: '[\'record\']',
  enum: '',
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
    metadata: Metadata<any>
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

      const modelType = `T${capitalizedAlias}OData`

      const typeInfo = opts.metadata.getType(odataType)
      if (typeInfo) {
        return `${modelType}['${typeKindMap[typeInfo.kind]}']['${odataType}']${typeKindMapEnd[typeInfo.kind]}`
      }

      return 'any'
  }
}

export function generateEntityTypeTypes(
  d: EntityType<any>,
  opts: {
    modelAlias: string
    capitalizedAlias?: string
    typesToGen: Set<string>
    metadata: Metadata<any>
  }
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
      record[navName] = opts.metadata.isV4 ? `Array<${targetEntityType}>` : `{ results: Array<${targetEntityType}> }`
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
  const entitySets: TGenerateEntitySetDefinition[] = []
  const entitiesToGen = (opts.entitySets ?? m.getEntitySetsList()) as string[]
  const typesToGen = new Set<string>()
  const processedTypes = new Set<string>()

  // add types mentioned in entity sets
  for (const entitySetName of entitiesToGen) {
    const entitySet = m.getEntitySet(entitySetName)
    if (entitySet) {
      const entityTypeName = entitySet.typeName
      typesToGen.add(entityTypeName)
      entitySets.push({
        name: entitySet.name,
        type: entityTypeName,
      })
    }
  }

  const modelConsts: TModelConsts = {}
  const modelTypes: TModelTypes = {}

  // add types mentioned in functions
  for (const fName of m.getFunctionsList()) {
    const fn = m.getFunction(fName)!

    const discoverType = (typeName?: string) => {
      if (!typeName) return
      const { actualType, isEdm } = parseType(typeName)
      if (!isEdm) {
        const typeInfo = m.getType(actualType)
        if (typeInfo) {
          typesToGen.add(actualType)
        }
      }
    }

    fn.params.forEach(p => discoverType(p.$Type))
    discoverType(fn.returnType.type)
  }

  const toProcess = Array.from(typesToGen)

  // add types mentioned in added types
  while (toProcess.length > 0) {
    const currentType = toProcess.pop()!
    if (processedTypes.has(currentType)) continue
    const typeDef = m.getType(currentType)
    if (!typeDef) continue

    processedTypes.add(currentType)
    if (typeDef.kind === 'entity') {
      const entityType = m.getEntityType(currentType)
      // Add all navigation target types to be processed
      Array.from(entityType.getNavsMap().values()).forEach(nav => {
        const targetType = nav.$Type
        if (!processedTypes.has(targetType) && !typesToGen.has(targetType)) {
          typesToGen.add(targetType)
          toProcess.push(targetType)
        }
      })

      // Discover types used by this entity type
      for (const field of entityType.fields) {
        // Check if the field type is not an Edm type
        if (!field.$Type.startsWith('Edm.') && field.$Type.includes('.')) {
          const typeInfo = m.getType(field.$Type)
          if (typeInfo && !processedTypes.has(field.$Type) && !typesToGen.has(field.$Type)) {
            typesToGen.add(field.$Type)
            toProcess.push(field.$Type)
          }
        }
      }
    }
    if (typeDef.kind === 'complex') {
      const d = typeDef.definition as TSchema['ComplexType'][number]
      for (const prop of d.Property || []) {
        const { actualType, isEdm } = parseType(prop.$Type)

        if (!isEdm && actualType.includes('.')) {
          const nestedTypeInfo = m.getType(actualType)
          if (nestedTypeInfo && !processedTypes.has(actualType)) {
            typesToGen.add(actualType)
            toProcess.push(actualType)
          }
        }
      }
    }
  }

  // Prepare const
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

  // Prepare interface
  elements.push({
    type: 'interface',
    name: 'T' + cModelAlias,
    value: modelTypes,
    exported: true,
    jsDocs: ['Types for Keys and Fields', '', `Model: ${modelAlias}`]
  })

  const entityTypes: TGenerateEntityTypeDefinition[] = []
  const complexTypes: Record<string, Record<string, unknown>> = {}
  const enumTypes: Record<string, string> = {}

  // generate types
  for (const currentType of Array.from(typesToGen)) {
    const {kind, definition} = m.getType(currentType) || {}
    if (!definition || !kind) continue

    // generate entity type
    if (kind === 'entity') {
      const entityType = m.getEntityType(currentType)
      const { entity, consts, types } = generateEntityTypeTypes(entityType, {
        modelAlias,
        capitalizedAlias: cModelAlias,
        typesToGen,
        metadata: m
      })
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

    // generate complex type
    if (kind === 'complex') {
      const complexType = definition as TSchema['ComplexType'][number]
      const ctRecord: Record<string, string> = {}
      for (const property of complexType.Property || []) {
        const { isCollection, actualType } = parseType(property.$Type)

        // Determine the TypeScript type using the helper function
        let tsType = mapODataTypeToTypeScript(actualType, {
          modelAlias,
          capitalizedAlias: cModelAlias,
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

      complexTypes[`'${currentType}'`] = ctRecord
    }

    // generate enum type
    if (kind === 'enum') {
      const enumType = definition as TSchema['EnumType'][number]
      // Generate a union type of string literals for the enum
      const members = (enumType.Member || []).map(member => `'${member.$Name}'`)
      enumTypes[`'${currentType}'`] = members.join(' | ') || 'never'
    }
  }

  const modelType = `T${cModelAlias}OData`

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
      actions: {},
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

  // generate functions
  for (const fName of m.getFunctionsList()) {
    const fn = m.getFunction(fName)!
    let params: string | Record<string, string> = 'never'
    let returnType: string = 'void'

    if (fn.params.length) {
      params = {}
      for (const p of fn.params) {
        const nullable = p.$Nullable !== false
        const paramType = mapODataTypeToTypeScript(p.$Type || 'Edm.String', {
          modelAlias,
          capitalizedAlias: cModelAlias,
          metadata: m
        })        
        params[p.$Name] = nullable && paramType !== 'string' ? `${paramType} | null` : paramType
      }
    }
    if (fn.returnType.type) {
      const { actualType, isCollection } = parseType(fn.returnType.type)
      const mappedType = mapODataTypeToTypeScript(actualType, {
        modelAlias,
        capitalizedAlias: cModelAlias,
        metadata: m
      })

      returnType = isCollection ? `Array<${mappedType}>` : mappedType

      // Check for nullable
      const nullable = fn.returnType.nullable !== false
      if (nullable && returnType !== 'string' && !isCollection) {
        returnType = `${returnType} | null`
      }
    }

    // Quote the function name to handle dots and other special characters
    modelInterface.value[fn.kind === 'Function' ? 'functions' : 'actions'][`'${fName}'`] = { params, returnType }
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

function parseType(type: string) {
  const isCollection = type.startsWith('Collection(')
  const actualType = isCollection ? type.slice(11, -1) : type
  return {
    isCollection,
    actualType,
    isEdm: actualType.startsWith('Edm.')
  }
}