import type { EntitySet } from '../metadata/entity-set'
import type { Metadata } from '../metadata/metadata'
import {
  codeGen,
  type TCoGeClassDeclaration,
  type TCoGeCodeElement,
  type TCoGeInterfaceDeclaration,
} from './code-gen-utils'

export interface TGenerateEntitySetDefinition {
  alias: string
  type: string
  keysType: string
  measuresType: string
  name: string
  keys: string
  measures: string
}

/**
 * Generates TypeScript types and constants for a given EntitySet.
 *
 * @param {EntitySet} d - The EntitySet for which to generate types.
 * @param {Object} opts - Options for generating the types.
 * @param {string} opts.modelAlias - The alias for the model.
 * @param {string} opts.entitySetAlias - The alias for the entity set.
 * @returns {Object} An object containing the generated code and entity details.
 * @returns {string} code - The generated TypeScript code as a string.
 * @returns {Object} entity - Details about the generated entity.
 * @returns {string} entity.alias - The alias for the entity set.
 * @returns {string} entity.type - The TypeScript type for the entity fields.
 * @returns {string} entity.name - The name of the entity set.
 * @returns {string} entity.keys - The keys of the entity set, joined by ' | '.
 */
export function generateEntitySetTypes(
  d: EntitySet,
  opts: {
    modelAlias: string
    entitySetAlias: string
  }
): {
  code: string
  entity: TGenerateEntitySetDefinition
} {
  const fieldNames = d.fields.map(field => field.$Name)
  const keys = d.keys
  const measures = d.fields.filter(f => f.isMeasure).map(field => field.$Name)

  const entitySetTypeName = `${opts.modelAlias}${opts.entitySetAlias}`

  const elements: TCoGeCodeElement[] = []

  elements.push({
    type: 'const',
    name: `${entitySetTypeName}EntitySet`,
    value: JSON.stringify(d.name),
    exported: true,
  })

  elements.push({
    type: 'const',
    name: `${entitySetTypeName}Fields`,
    value: `[\n  ${fieldNames.map(name => JSON.stringify(name)).join(',\n  ')}\n] as const`,
    exported: true,
  })
  elements.push({
    type: 'const',
    name: `${entitySetTypeName}Keys`,
    value: `[\n  ${keys.map(name => JSON.stringify(name)).join(',\n  ')}\n] as const`,
    exported: true,
  })
  elements.push({
    type: 'const',
    name: `${entitySetTypeName}Measures`,
    value: measures.length
      ? `[\n  ${measures.map(name => JSON.stringify(name)).join(',\n  ')}\n] as const`
      : '[] as const',
    exported: true,
  })

  elements.push({
    type: 'type',
    name: `T${entitySetTypeName}Fields`,
    value: `typeof ${entitySetTypeName}Fields[number]`,
    exported: true,
  })
  elements.push({
    type: 'type',
    name: `T${entitySetTypeName}Keys`,
    value: `typeof ${entitySetTypeName}Keys[number]`,
    exported: true,
  })
  elements.push({
    type: 'type',
    name: `T${entitySetTypeName}Measures`,
    value: `typeof ${entitySetTypeName}Measures[number]`,
    exported: true,
  })

  const code = codeGen(elements)

  return {
    code,
    entity: {
      alias: opts.entitySetAlias,
      type: `T${entitySetTypeName}Fields`,
      keysType: `T${entitySetTypeName}Keys`,
      measuresType: `T${entitySetTypeName}Measures`,
      name: d.name,
      keys: keys.map(k => JSON.stringify(k)).join(' | '),
      measures: measures.map(k => JSON.stringify(k)).join(' | '),
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
  alias?: string
  odataUrl?: string
  entitySets: (string | { name: string; alias?: string })[] | '*'
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
  const modelAlias = opts.alias || serviceName
  const elements: TCoGeCodeElement[] = []

  // Exported constant for the model name
  elements.push({
    type: 'const',
    name: `${modelAlias}Name`,
    value: JSON.stringify(m.name),
    exported: true,
  })

  const entities: TGenerateEntitySetDefinition[] = []
  const entitiesToGen = opts.entitySets === '*' ? m.getEntitySetsList() : opts.entitySets

  for (const entitySetOptions of entitiesToGen) {
    const entitySetName = (
      typeof entitySetOptions === 'object' ? entitySetOptions.name : entitySetOptions
    ) as string
    const entitySet = m.getEntitySet(entitySetName)
    if (entitySet) {
      const entitySetAlias = (
        typeof entitySetOptions === 'object'
          ? entitySetOptions.alias || entitySetName
          : entitySetName
      ) as string
      const { code, entity } = generateEntitySetTypes(entitySet as EntitySet, {
        modelAlias,
        entitySetAlias,
      })
      entities.push({
        alias: entity.alias,
        type: entity.type,
        keysType: entity.keysType,
        measuresType: entity.measuresType,
        name: entity.name,
        keys: entity.keys,
        measures: entity.measures,
      })

      // Add a comment line
      elements.push(`// ${serviceName}/${entitySetName}`)

      // Since `generateEntitySetTypes` returns code, we need to parse it into CodeElements
      // Alternatively, we can modify `generateEntitySetTypes` to return CodeElements directly
      // For now, we can include the generated code as CodeLines
      const entitySetCodeLines = code.split('\n').filter(line => line.trim() !== '')
      elements.push(...entitySetCodeLines)

      console.log(`[odata-codegen] Generated types for "${serviceName}/${entitySetName}"`)
    }
  }

  const modelType = `T${modelAlias}Type`

  const modelInterface: TCoGeInterfaceDeclaration = {
    type: 'interface',
    name: modelType,
    exported: true,
    extends: ['TOdataDummyInterface'],
    value: {
      entitySets: {},
      functions: {},
    },
  }

  const entityNames = {} as Record<string, string>
  for (const entity of entities) {
    entityNames[entity.alias] = `${JSON.stringify(entity.name)} as const`
    modelInterface.value.entitySets[entity.name] = {
      keys: entity.keysType,
      fields: entity.type,
      measures: entity.measuresType,
    }
  }

  for (const fName of m.getFunctionsList()) {
    const rawFunction = m.getRawFunction(fName)!
    const params =
      rawFunction.Parameter.filter(p => p.$Mode === 'In')
        .map(p => JSON.stringify(p.$Name))
        .join(' | ') || 'void'
    modelInterface.value.functions[fName] = { params }
  }

  elements.push(modelInterface)

  const modelClass: TCoGeClassDeclaration = {
    type: 'class',
    name: modelAlias,
    exported: true,
    extends: `OData<${modelType}>`,
    props: [
      {
        name: 'readonly name',
        static: true,
        visibility: 'public',
        value: `${JSON.stringify(serviceName)} as const`,
      },
      {
        name: 'instance?',
        static: true,
        visibility: 'private',
        type: modelAlias,
      },
      {
        name: 'entityAliases',
        static: true,
        value: {
          type: 'object',
          value: entityNames,
        },
      },
    ],
    methods: [
      {
        name: 'getInstance',
        visibility: 'public',
        static: true,
        args: {},
        body: [
          `if (!${modelAlias}.instance) {`,
          `  ${modelAlias}.instance = new ${modelAlias}()`,
          `}`,
          `return ${modelAlias}.instance`,
        ],
      },
      {
        name: 'constructor',
        visibility: 'private',
        args: {
          'opts?': 'TODataOptions',
        },
        body: [
          `super(${JSON.stringify(serviceName)}, {...opts, url: ${JSON.stringify(opts.odataUrl)}})`,
        ],
      },
    ],
  }

  elements.push(modelClass)

  const code = codeGen(elements)
  return code
}
