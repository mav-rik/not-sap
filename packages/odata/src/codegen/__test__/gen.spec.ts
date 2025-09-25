import { describe, it, expect, beforeAll } from 'vitest';
import { generateTypes, type TODataServicesToParse } from '../index';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

describe('OData Code Generation', () => {
  const metadataDir = join(__dirname, 'metadata');
  const generatedDir = join(__dirname, 'generated');

  beforeAll(async () => {
    // Ensure generated directory exists
    mkdirSync(generatedDir, { recursive: true });

    // Read all XML files from metadata folder
    const xmlFiles = readdirSync(metadataDir).filter(file => file.endsWith('.xml'));

    // Process each XML file
    for (const xmlFile of xmlFiles) {
      const xmlPath = join(metadataDir, xmlFile);
      const xmlContent = readFileSync(xmlPath, 'utf-8');

      // Extract service name from filename (e.g., 'northwind-v2.xml' -> 'northwind-v2')
      const serviceName = xmlFile.replace('.xml', '');

      // Configure services for generateTypes
      const services: TODataServicesToParse = {
        [serviceName]: {
          metadata: xmlContent,
          // Default host and path for test purposes
          host: 'http://localhost',
          path: `/odata/${serviceName}`
        }
      };

      // Generate TypeScript types
      const generatedContent = await generateTypes(services);

      // Write generated TypeScript to file
      const outputPath = join(generatedDir, `${serviceName}.ts`);
      writeFileSync(outputPath, generatedContent);

      console.log(`Generated types for ${serviceName} -> ${outputPath}`);
    }
  });

  it('should generate types for all metadata files', () => {
    // Check that generated files exist
    const xmlFiles = readdirSync(metadataDir).filter(file => file.endsWith('.xml'));
    const generatedFiles = readdirSync(generatedDir).filter(file => file.endsWith('.ts'));

    // Should have one generated file for each XML file
    expect(generatedFiles.length).toBe(xmlFiles.length);

    // Check each expected file exists
    xmlFiles.forEach(xmlFile => {
      const expectedTsFile = xmlFile.replace('.xml', '.ts');
      expect(generatedFiles).toContain(expectedTsFile);
    });
  });

  it('should generate valid TypeScript code', () => {
    const generatedFiles = readdirSync(generatedDir).filter(file => file.endsWith('.ts'));

    generatedFiles.forEach(file => {
      const filePath = join(generatedDir, file);
      const content = readFileSync(filePath, 'utf-8');

      // Basic checks for TypeScript validity
      expect(content).toContain('import');
      expect(content).toContain('interface');
      expect(content).toContain('export');

      // Check for generated file header
      expect(content).toContain('This code was GENERATED');
    });
  });

  it('should generate entity type interfaces for northwind-v2', () => {
    const northwindV2Path = join(generatedDir, 'northwind-v2.ts');
    const content = readFileSync(northwindV2Path, 'utf-8');

    // Check for common Northwind entities as TypeScript types and constants
    expect(content).toContain('northwindV2CustomersEntitySet');
    expect(content).toContain('northwindV2ProductsEntitySet');
    expect(content).toContain('northwindV2OrdersEntitySet');

    // Check for the main interface
    expect(content).toContain('interface TnorthwindV2Type');
  });

  it('should generate entity type interfaces for northwind-v4', () => {
    const northwindV4Path = join(generatedDir, 'northwind-v4.ts');
    const content = readFileSync(northwindV4Path, 'utf-8');

    // Check for OData v4 specific features
    expect(content).toContain('interface');
    expect(content).toContain('export');
  });

  it('should generate types for hana-v4-param', () => {
    const hanaPath = join(generatedDir, 'hana-v4-param.ts');
    const content = readFileSync(hanaPath, 'utf-8');

    // Check that the file has content
    expect(content.length).toBeGreaterThan(0);
    expect(content).toContain('interface');
  });
});