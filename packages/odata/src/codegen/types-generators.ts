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

export function generateEntityTypeTypes(
  d: EntityType<any>,
  opts: {
    modelAlias: string
    capitalizedAlias?: string
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

  d.getNavsMap()

  const navToMany: TGenerateEntityTypeDefinition['navToMany'] = {}
  const navToOne: TGenerateEntityTypeDefinition['navToOne'] = {}

  for (const nav of Array.from(d.getNavsMap().values())) {
    const target = nav.toMany ? navToMany : navToOne
    target[nav.$Name as string] = JSON.stringify(nav.$Type)
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

  for (const et of Array.from(entityTypesToGen)) {
    const entityType = m.getEntityType(et)
    entityType.navToMany?.forEach(n => entityTypesToGen.add(n.$Type))
    entityType.navToOne?.forEach(n => entityTypesToGen.add(n.$Type))
  }

  for (const et of Array.from(entityTypesToGen)) {
    const entityType = m.getEntityType(et)
    const { entity, consts, types } = generateEntityTypeTypes(entityType, {
      modelAlias,
      capitalizedAlias: cModelAlias
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

  const modelInterface: TCoGeInterfaceDeclaration = {
    type: 'interface',
    name: modelType,
    exported: true,
    extends: ['TOdataDummyInterface'],
    value: {
      entitySets: {},
      entityTypes: {},
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
    }
  }

  for (const entitySet of entitySets) {
    modelInterface.value['entitySets'][`'${entitySet.name}'`] = JSON.stringify(entitySet.type)
  }

  for (const fName of m.getFunctionsList()) {
    const rawFunction = m.getRawFunction(fName)!
    const params =
      rawFunction.Parameter.filter(p => p.$Mode === 'In')
        .map(p => JSON.stringify(p.$Name))
        .join(' | ') || 'void'
    modelInterface.value['functions'][fName] = { params }
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
          `super(${JSON.stringify(serviceName)}, {...opts, ${opts.host ? 'host: ' + JSON.stringify(opts.host) + ', ' : ''}path: ${JSON.stringify(opts.path)}})`,
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