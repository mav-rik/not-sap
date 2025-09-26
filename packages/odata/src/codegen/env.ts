import { existsSync, readFileSync } from 'fs'

/**
 * Reads the OData environment variables from a .env file and the process environment.
 *
 * @returns An object containing the OData host and cookie values.
 *          - `host`: The SAP OData host URL.
 *          - `cookie`: The SAP cookie name and value concatenated as a single string.
 */
export function readODataEnv(): { host: string; cookie: string } {
  const envString = (existsSync('./.env') && readFileSync('./.env').toString()) || ''
  const e = process.env as any
  const env = {
    ODATA_HOST: e.ODATA_HOST,
    ODATA_COOKIE_VALUE: e.ODATA_COOKIE_VALUE,
    ODATA_COOKIE_NAME: e.ODATA_COOKIE_NAME,
  } as { ODATA_HOST?: string; ODATA_COOKIE_VALUE?: string; ODATA_COOKIE_NAME?: string }
  envString.split('\n').forEach(line => {
    const parts = line.split('=')
    env[parts[0] as 'ODATA_HOST'] = parts.slice(1).join('')
  })

  return {
    host: env.ODATA_HOST || '',
    cookie: env.ODATA_COOKIE_NAME ? `${env.ODATA_COOKIE_NAME || ''}=${env.ODATA_COOKIE_VALUE || ''}` : '',
  }
}
