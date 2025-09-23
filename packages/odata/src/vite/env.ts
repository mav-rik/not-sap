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
  const env = {
    SAP_ODATA_HOST: process.env.SAP_ODATA_HOST,
    SAP_COOKIE_VALUE: process.env.SAP_COOKIE_VALUE,
    SAP_COOKIE_NAME: process.env.SAP_COOKIE_NAME,
  } as { SAP_ODATA_HOST?: string; SAP_COOKIE_VALUE?: string; SAP_COOKIE_NAME?: string }
  envString.split('\n').forEach(line => {
    const parts = line.split('=')
    env[parts[0] as 'SAP_ODATA_HOST'] = parts.slice(1).join('')
  })

  return {
    host: env.SAP_ODATA_HOST || '',
    cookie: `${env.SAP_COOKIE_NAME || ''}=${env.SAP_COOKIE_VALUE || ''}`,
  }
}
