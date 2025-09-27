import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { TripPinRESTierService } from './generated/TripPinRESTierService'
import {
  metadataTripPinXml,
  resetServiceInstances,
  setupGlobalMocks,
  teardownGlobalMocks,
} from './test-utils'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICE_HOST = 'https://services.odata.org'

type FixtureFile = {
  description: string
  requests: {
    url: string
    response: unknown
  }[]
}

function loadFixture(scenario: string): FixtureFile {
  const fixturePath = join(__dirname, 'fixtures', 'trippin', `${scenario}.json`)
  return JSON.parse(readFileSync(fixturePath, 'utf-8')) as FixtureFile
}

function buildResponseMap(scenarios: readonly string[]) {
  const map = new Map<string, unknown>()
  for (const scenario of scenarios) {
    const fixture = loadFixture(scenario)
    for (const request of fixture.requests) {
      map.set(request.url, request.response)
    }
  }
  return map
}

describe('TripPin RESTier fixture replays', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  const scenarios = [
    'people-with-expands',
    'airports-with-location',
    'function-get-person-with-most-friends',
    'function-get-nearest-airport',
  ] as const

  it('replays people, airports, and function scenarios', async () => {
    const responseMap = buildResponseMap(scenarios)

    const service = TripPinRESTierService.getInstance()
    service.options.host = SERVICE_HOST
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataTripPinXml)

    const fetchMock = vi.spyOn(service, '_fetch').mockImplementation(async (url: string) => {
      const response = responseMap.get(url)
      if (!response) {
        throw new Error(`Missing fixture for url ${url}`)
      }
      return response
    })

    const people = await service.entitySet('People')
    const friendsExpand = people.expand('Friends', {
      select: ['UserName', 'FirstName', 'LastName'],
    })
    const tripsExpand = people
      .expand('Trips', {
        select: ['TripId', 'Name', 'Budget', 'StartsAt', 'EndsAt'],
      })
      .expand('PlanItems', {
        select: ['PlanItemId', 'ConfirmationCode', 'StartsAt', 'EndsAt', 'Duration'],
      })

    const peopleResult = await people.query({
      top: 1,
      filter: "UserName eq 'russellwhyte'",
      select: ['UserName', 'FirstName', 'LastName', 'AddressInfo', 'Emails', 'Features'],
      expand: [friendsExpand, tripsExpand],
    })

    expect(peopleResult.data).toHaveLength(1)
    const person = peopleResult.data[0]
    expect(Array.isArray(person.AddressInfo)).toBe(true)
    expect(person.AddressInfo?.[0]?.City?.Name).toBeDefined()
    expect(person.Trips?.[0].PlanItems?.length).toBeGreaterThan(0)
    expect(person.Friends?.length).toBeGreaterThan(0)

    const airports = await service.entitySet('Airports')
    const airportsResult = await airports.query({
      top: 3,
      select: ['IcaoCode', 'IataCode', 'Name', 'Location'],
      filter: "startswith(Name,'San')",
      sorters: ['Name'],
    })

    expect(airportsResult.data.length).toBeGreaterThan(0)
    const airport = airportsResult.data[0]
    expect(airport.Location?.Loc).toBeDefined()

    const mostFriends = await service.callFunction('GetPersonWithMostFriends')
    expect(mostFriends?.UserName).toBeTruthy()
    expect(mostFriends?.Friends).toBeUndefined()

    const nearestAirport = await service.callFunction(
      'GetNearestAirport',
      {
        lat: 33.63,
        lon: -84.42,
      }
    )
    expect(nearestAirport?.IcaoCode).toBeTruthy()
    expect(nearestAirport?.Location?.Loc).toBeDefined()

    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
