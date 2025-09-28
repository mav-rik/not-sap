import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { TaskServiceV4 } from './generated/task-service-v4'
import { PostFunctionsV2 } from './generated/post-functions-v2'
import {
  metadataTaskServiceV4Xml,
  metadataPostFunctionsV2Xml,
  resetServiceInstances,
  setupGlobalMocks,
  teardownGlobalMocks,
} from './test-utils'

type FixtureRequest = {
  url: string
  method?: string
  body?: unknown
  response: unknown
}

type FixtureFile = {
  description: string
  requests: FixtureRequest[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICE_HOST = 'https://example.test'

function loadFixture(serviceFolder: string, scenario: string): FixtureFile {
  const fixturePath = join(__dirname, 'fixtures', serviceFolder, `${scenario}.json`)
  const contents = readFileSync(fixturePath, 'utf-8')
  return JSON.parse(contents) as FixtureFile
}

function buildResponseMap(serviceFolder: string, scenarios: readonly string[]) {
  const map = new Map<string, FixtureRequest>()
  for (const scenario of scenarios) {
    const fixture = loadFixture(serviceFolder, scenario)
    for (const request of fixture.requests) {
      const method = (request.method ?? 'GET').toUpperCase()
      map.set(`${method} ${request.url}`, request)
    }
  }
  return map
}

describe('Custom action and POST function fixtures', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  it('replays TaskServiceV4 action and PostFunctionsV2 function import', async () => {
    const taskScenarios = ['complete-task', 'reassign-task'] as const
    const taskFixtures = taskScenarios.flatMap(scenario =>
      loadFixture('task-service-v4', scenario).requests
    )
    const taskResponseMap = buildResponseMap('task-service-v4', taskScenarios)
    const expectedTaskKeys = taskFixtures.map(request => {
      const method = (request.method ?? 'GET').toUpperCase()
      return `${method} ${request.url}`
    })

    const taskService = TaskServiceV4.getInstance()
    taskService.options.host = SERVICE_HOST
    vi.spyOn(taskService, 'readMetadata').mockResolvedValue(metadataTaskServiceV4Xml)

    const taskCalledKeys: string[] = []
    const taskFetchMock = vi
      .spyOn(taskService, '_fetch')
      .mockImplementation(async (url: string, options: { method?: string; body?: string; headers?: Record<string, string> }, _format: string) => {
        const method = (options.method ?? 'GET').toUpperCase()
        const key = `${method} ${url}`
        taskCalledKeys.push(key)
        const fixture = taskResponseMap.get(key)
        if (!fixture) {
          expect(key).oneOf(Array.from(taskResponseMap.keys()), `Missing fixture for url ${key}`)
          // throw new Error(`Missing fixture for url ${key}`)
          return undefined
        }
        expect(method).toBe((fixture.method ?? 'GET').toUpperCase())
        if (fixture.body !== undefined) {
          expect(options.body).toBeDefined()
          const parsed = options.body ? JSON.parse(options.body) : undefined
          expect(parsed).toEqual(fixture.body)
          const headers = options.headers ?? {}
          const contentType = headers['content-type'] ?? headers['Content-Type']
          expect(contentType).toContain('application/json')
        }
        return fixture.response as any
      })

    const actionResult = await taskService.callAction('CompleteTask', {
      TaskId: '0f8fad5b-d9cb-469f-a165-70867728950e',
      Comment: 'Done',
      Rating: 5,
    })
    
    expect(actionResult.Id).toBe('0f8fad5b-d9cb-469f-a165-70867728950e')
    expect(actionResult.Title).toBe('Prepare Quarterly Budget')
    expect(actionResult.Status).toBe('Completed')
    expect(actionResult.Owner).toBe('ROOT')

    const tasks = await taskService.entitySet('Tasks')
    const reassignResult = await tasks.withKey({Id: '0f8fad5b-d9cb-469f-a165-70867728950e'}).callAction('ReassignTask', {
      NewOwner: 'Sally',
    })

    expect(reassignResult.Owner).toBe('Sally')

    expect(taskFetchMock).toHaveBeenCalledTimes(expectedTaskKeys.length)
    expect(taskCalledKeys).toEqual(expectedTaskKeys)

    const invoiceScenarios = ['create-invoice', 'close-invoice'] as const
    const invoiceFixtures = invoiceScenarios.flatMap(scenario =>
      loadFixture('post-functions-v2', scenario).requests
    )
    const invoiceResponseMap = buildResponseMap('post-functions-v2', invoiceScenarios)
    const expectedInvoiceKeys = invoiceFixtures.map(request => {
      const method = (request.method ?? 'GET').toUpperCase()
      return `${method} ${request.url}`
    })

    const invoiceService = PostFunctionsV2.getInstance()
    invoiceService.options.host = SERVICE_HOST
    vi.spyOn(invoiceService, 'readMetadata').mockResolvedValue(metadataPostFunctionsV2Xml)

    const invoiceCalledKeys: string[] = []
    const invoiceFetchMock = vi
      .spyOn(invoiceService, '_fetch')
      .mockImplementation(async (url: string, options: { method?: string; body?: string; headers?: Record<string, string> }, _format: string) => {
        const method = (options.method ?? 'GET').toUpperCase()
        const key = `${method} ${url}`
        invoiceCalledKeys.push(key)
        const fixture = invoiceResponseMap.get(key)
        if (!fixture) {
          throw new Error(`Missing fixture for url ${key}`)
        }
        expect(method).toBe((fixture.method ?? 'GET').toUpperCase())
        if (fixture.body !== undefined) {
          expect(options.body).toBeDefined()
          const parsed = options.body ? JSON.parse(options.body) : undefined
          expect(parsed).toEqual(fixture.body)
          const headers = options.headers ?? {}
          const contentType = headers['content-type'] ?? headers['Content-Type']
          expect(contentType).toContain('application/json')
        }
        return fixture.response as any
      })

    const functionResult = await invoiceService.callAction('CreateInvoice', {
      Customer: 'ALFKI',
      Amount: 250.75,
    })

    expect(functionResult?.InvoiceID).toBe(9001)
    expect(functionResult?.Status).toBe('Created')

    const invoices = await invoiceService.entitySet('Invoices')
    const closeResult = await invoices.withKey({InvoiceID: 9001}).callAction('CloseInvoice', {
      InvoiceID: 9001,
      Reason: 'Paid in full',
    })

    expect(closeResult).toEqual({
      CloseInvoice: true,
    })

    expect(invoiceFetchMock).toHaveBeenCalledTimes(expectedInvoiceKeys.length)
    expect(invoiceCalledKeys).toEqual(expectedInvoiceKeys)
  })
})
