import { generate, type TODataServicesToParse } from '../index'
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Pre-test script that generates TypeScript files from metadata XMLs
 * with different configuration options for testing purposes.
 */
async function generateTestArtifacts() {
  const metadataDir = join(__dirname, 'metadata')
  const generatedDir = join(__dirname, 'generated')

  console.log('🔧 Pre-test: Generating TypeScript artifacts from metadata XMLs...')

  // Clean and recreate generated directory
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true })
  }
  mkdirSync(generatedDir, { recursive: true })

  // Read all XML files from metadata folder
  const xmlFiles = readdirSync(metadataDir).filter(file => file.endsWith('.xml'))

  console.log(`📁 Found ${xmlFiles.length} metadata files to process`)

  // Process each XML file with different configurations
  for (const xmlFile of xmlFiles) {
    const xmlPath = join(metadataDir, xmlFile)
    const xmlContent = readFileSync(xmlPath, 'utf-8')
    const baseName = xmlFile.replace('.xml', '')

    console.log(`\n📄 Processing ${xmlFile}...`)

    // Configuration 1: Generate with no options (all entity sets)
    await generateWithAllEntitySets(baseName, xmlContent, generatedDir)

    // Configuration 2: Generate with selected entity sets and aliases
    await generateWithSelectedEntitySets(baseName, xmlContent, generatedDir)
  }

  // Configuration 3: Generate combined services (sap-v4 + hana-v4-param)
  await generateCombinedServices(metadataDir, generatedDir)

  console.log('\n✅ Pre-test generation completed successfully!')
}

/**
 * Generate TypeScript with all entity sets (no filtering)
 */
async function generateWithAllEntitySets(
  serviceName: string,
  xmlContent: string,
  outputDir: string
) {
  console.log(`  • Generating ${serviceName}.ts (all entity sets)...`)

  const paths = {
    'northwind-v4': '/V4/Northwind/Northwind.svc',
    'northwind-v2': '/V2/Northwind/Northwind.svc',
  }

  const services: TODataServicesToParse = {
    [serviceName]: {
      metadata: xmlContent,
      path: paths[serviceName as keyof typeof paths] ?? `/odata/path/${serviceName}`,
    }
  }

  try {
    const generatedContent = await generate(services)
    const outputPath = join(outputDir, `${serviceName}.ts`)
    writeFileSync(outputPath, generatedContent)
    console.log(`    ✓ Generated: ${outputPath}`)
  } catch (error) {
    console.error(`    ✗ Error generating ${serviceName}:`, error)
    throw error
  }
}

/**
 * Generate TypeScript with selected entity sets and custom aliases
 */
async function generateWithSelectedEntitySets(
  serviceName: string,
  xmlContent: string,
  outputDir: string
) {
  // Skip if not applicable for certain metadata files
  const entitySetConfigs = getEntitySetConfigForService(serviceName)
  if (!entitySetConfigs) {
    return
  }

  console.log(`  • Generating ${serviceName}-selected.ts (selected entity sets with aliases)...`)

  const services: TODataServicesToParse = {
    [`${serviceName}-selected`]: {
      metadata: xmlContent,
      path: `/odata/${serviceName}`,
      alias: `${serviceName}Selected`,
      entitySets: entitySetConfigs
    }
  }

  try {
    const generatedContent = await generate(services)
    const outputPath = join(outputDir, `${serviceName}-selected.ts`)
    writeFileSync(outputPath, generatedContent)
    console.log(`    ✓ Generated: ${outputPath}`)
  } catch (error) {
    console.error(`    ✗ Error generating ${serviceName}-selected:`, error)
    throw error
  }
}

/**
 * Generate TypeScript by combining multiple XML metadata files
 */
async function generateCombinedServices(
  metadataDir: string,
  outputDir: string
) {
  console.log('\n📄 Processing combined services (sap-v4 + hana-v4-param)...')
  console.log('  • Generating combined-services.ts (combining multiple metadata files)...')

  // Read the XML files to combine
  const sapV4Path = join(metadataDir, 'sap-v4.xml')
  const hanaV4Path = join(metadataDir, 'hana-v4-param.xml')

  if (!existsSync(sapV4Path) || !existsSync(hanaV4Path)) {
    console.log('    ⚠️  Skipping combined generation: required XML files not found')
    return
  }

  const sapV4Content = readFileSync(sapV4Path, 'utf-8')
  const hanaV4Content = readFileSync(hanaV4Path, 'utf-8')

  // Create combined services configuration
  const services: TODataServicesToParse = {
    'sapService': {
      metadata: sapV4Content,
      host: 'http://localhost',
      path: '/odata/sap-v4',
      alias: 'SapService'
    },
    'hanaService': {
      metadata: hanaV4Content,
      host: 'http://localhost',
      path: '/odata/hana-v4-param',
      alias: 'HanaService'
    }
  }

  try {
    const generatedContent = await generate(services)
    const outputPath = join(outputDir, 'combined-services.ts')
    writeFileSync(outputPath, generatedContent)
    console.log(`    ✓ Generated: ${outputPath}`)
  } catch (error) {
    console.error('    ✗ Error generating combined services:', error)
    throw error
  }
}

/**
 * Get entity set configuration based on the service name
 */
function getEntitySetConfigForService(
  serviceName: string
): string[] | undefined {
  const configs: Record<string, string[]> = {
    'northwind-v2': ['ODataWeb.Northwind.Model.Products', 'ODataWeb.Northwind.Model.Suppliers'],
    'northwind-v4': ['ODataWebV4.Northwind.Model.Products', 'ODataWebV4.Northwind.Model.Suppliers']
  }

  return configs[serviceName]
}

// Run the generation if this script is executed directly
import { argv } from 'process'

const isMainModule = argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
  generateTestArtifacts().catch(error => {
    console.error('❌ Pre-test generation failed:', error)
    process.exit(1)
  })
}

export { generateTestArtifacts }