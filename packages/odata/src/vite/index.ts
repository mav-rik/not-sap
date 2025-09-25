import type { Plugin } from 'vite';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { readODataEnv } from '../codegen/env';
import { generateTypes, TODataServicesToParse } from '../codegen';

interface ODataPluginOptions {
  filename?: string
  services: TODataServicesToParse
}

const defaultFilename = 'src/.odata.types.ts';
const root = process.cwd();

/**
 * Vite plugin to generate TypeScript type definitions for OData services.
 *
 * This plugin automatically generates TypeScript types from OData service metadata
 * during the Vite build process. It reads environment variables for configuration
 * and outputs a single TypeScript file containing all service type definitions.
 *
 * @param options - Configuration options for the OData code generation plugin
 * @param options.filename - Optional output filename for generated types. Defaults to 'src/.odata.types.ts'
 * @param options.services - Required mapping of service names to their configuration options.
 *                          Each service can specify host, path, headers, and metadata source.
 *
 * @returns A Vite plugin that generates TypeScript types during the build process
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { odataCodegenPlugin } from 'notsapodata/vite';
 *
 * export default {
 *   plugins: [
 *     odataCodegenPlugin({
 *       services: {
 *         MyService: {
 *           host: 'https://api.example.com',
 *           path: '/odata/v2/ServiceName'
 *         }
 *       }
 *     })
 *   ]
 * }
 * ```
 *
 * @remarks
 * The plugin reads ODATA_HOST and ODATA_COOKIE from environment variables
 * if not specified in the service configuration.
 */
export function odataCodegenPlugin(options: ODataPluginOptions): Plugin {
  return {
    name: 'odata-codegen',
    async buildStart() {
      const env = readODataEnv();
      const services = {} as TODataServicesToParse
      for (const [key, service] of Object.entries(options.services)) {
        service.host = service.host || env.host
        service.headers = service.headers || {}
        if (env.cookie) {
          service.headers['cookie'] = env.cookie
        }
        if (!service.host && !service.metadata) {
          console.error(
            `[odata-codegen] Skipping odata codegen for "${key}" due to missing ODATA_HOST environment variable. You can set "host" prop in options or pass metadata to options.`
          );
        } else {
          services[key] = service
        }
      }
      const content = await generateTypes({ services })
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
