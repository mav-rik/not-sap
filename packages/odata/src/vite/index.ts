import type { Plugin } from 'vite';
import { OData } from '../odata';
import { generateModelTypes, type TGenerateModelOpts } from '../codegen/types-generators';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { readODataEnv } from '../codegen/env';

interface ODataPluginOptions {
  host?: string
  headers?: Record<string, string>
  filename?: string
  services: {
    [serviceName: string]: TGenerateModelOpts;
  };
}

const defaultFilename = 'src/.odata.types.ts';
const root = process.cwd();

/**
 * Vite plugin to generate TypeScript type definitions for OData services.
 *
 * @param {ODataPluginOptions} options - Configuration options for the plugin.
 * @param {string} [options.filename] - The output filename for the generated types.
 * @param {string} [options.odataUrl] - The base URL for the OData services.
 * @param {Object} options.services - A mapping of service names to their generation options.
 *
 * @returns {Plugin} The configured Vite plugin.
 */
export function odataCodegenPlugin(options: ODataPluginOptions): Plugin {
  return {
    name: 'odata-codegen',
    async buildStart() {
      const env = readODataEnv();
      const host = options.host || env.host
      if (!env.host) {
        console.error(
          '[odata-codegen] Skipping odata codegen due to missing SAP_ODATA_HOST environment variable'
        );
        return;
      }
      let content = `/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/\n
`;
      content += `/* eslint-disable */\n/* prettier-ignore */\n\n`;
      content += `import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"\n\n`;
      for (const [serviceName, serviceOptions] of Object.entries(options.services)) {
        const odata = new OData(serviceName, {
          host: host,
          url: serviceOptions.odataUrl,
          headers: options.headers,
        });

        try {
          const metadata = await odata.getMetadata();
          content += '\n';
          content += generateModelTypes(metadata, serviceOptions);
        } catch (error) {
          console.error(
            `[odata-codegen] "${
              (error as Error).message || 'Unknown error'
            }" while fetching metadata for service ${serviceName}`
          );
          return;
        }
      }
      const outputPath = join(root, options.filename || defaultFilename);
      if (existsSync(outputPath)) {
        unlinkSync(outputPath);
      }
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, content);
      console.log(`[odata-codegen] Generated "${options.filename || defaultFilename}"`);
    },
  };
}
