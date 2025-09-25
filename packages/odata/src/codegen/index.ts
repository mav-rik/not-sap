import { OData } from 'notsapodata/odata';
import { generateModelTypes, TGenerateModelOpts } from './types-generators';
import { Metadata } from 'notsapodata/metadata';

export * from './env'
export * from './types-generators'

export interface TODataServicesToParse {
    [serviceName: string]: TGenerateModelOpts & {
      metadata?: string | ((odata: OData, opts: TGenerateModelOpts) => string | Promise<string>)
    };
  };

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
function toSafeVariableName(name: string): string {
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
 * Generates TypeScript type definitions for OData services.
 *
 * @param services - An object containing OData service configurations to parse and generate types for.
 *                   Each service is keyed by its name and includes connection options and metadata configuration.
 * @returns A string containing the complete TypeScript code with type definitions for all provided OData services.
 *          The output includes generated interfaces, types, and helper functions for each service.
 *
 * @example
 * ```typescript
 * const types = await generateTypes({
 *   MyService: {
 *     host: 'https://api.example.com',
 *     path: '/odata/v2/ServiceName',
  *   }
 * });
 * ```
 */
export async function generateTypes(services: TODataServicesToParse) {
      let content = `/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/\n
`;
      content += `/* eslint-disable */\n/* prettier-ignore */\n\n`;
      content += `import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"\n\n`;
      for (const [serviceName, serviceOptions] of Object.entries(services)) {
        const odata = new OData(serviceName, {
          host: serviceOptions.host,
          path: serviceOptions.path,
          headers: serviceOptions.headers,
        });

        // Transform service name to be safe for TypeScript variables
        const safeServiceName = toSafeVariableName(serviceName);

        try {
          const readMetadata = typeof serviceOptions.metadata === 'string' ? (() => serviceOptions.metadata as string ) : (serviceOptions.metadata ?? ((_odata: OData) => _odata.readMetadata()))
          const metadataXml = await readMetadata(odata, serviceOptions)
          const m = new Metadata<any>(metadataXml, odata, safeServiceName)
          content += '\n';
          content += generateModelTypes(m, serviceOptions);
        } catch (error) {
          console.error(
            `[odata-codegen] "${
              (error as Error).message || 'Unknown error'
            }" while fetching metadata for service ${serviceName}`
          );
        }
      }

      return content
}