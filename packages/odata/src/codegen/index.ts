import { OData } from '../odata';
import { generateModelTypes, TGenerateModelOpts, toSafeVariableName } from './types-generators';
import { Metadata } from '../metadata';

export { readODataEnv } from './env'

export interface TODataServicesToParse {
    [serviceName: string]: TGenerateModelOpts & {
      metadata?: string | ((odata: OData, opts: TGenerateModelOpts) => string | Promise<string>)
    };
  };

/**
 * ## Generates TypeScript type definitions for OData services.
 *
 * @param services - An object containing OData service configurations to parse and generate types for.
 *                   Each service is keyed by its name and includes connection options and metadata configuration.
 * @returns A string containing the complete TypeScript code with type definitions for all provided OData services.
 *          The output includes generated interfaces, types, and helper functions for each service.
 *
 * @example
 * ```typescript
 * const types = await generate({
 *   MyService: {
 *     host: 'https://api.example.com',
 *     path: '/odata/v2/ServiceName',
  *  }
 * });
 * ```
 */
export async function generate(services: TODataServicesToParse) {
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