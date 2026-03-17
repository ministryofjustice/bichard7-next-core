import expect from "expect"
import type { LedsBichard } from "../../types/LedsMock"
import type { Operation } from "../converters/convertPncToLeds"
import convertPncToLeds from "../converters/convertPncToLeds"
import normaliseForComparison from "../normaliseForComparison"
import { delay } from "../puppeteer-utils"
import type { RequestResponseMock } from "./MockServer"

const MAX_RETRIES = 4
const DELAY_SECONDS = 3

const pathMapping: Record<string, Operation> = {
  "court-case-disposal-result": "Add Disposal",
  "basic-remands": "Remand",
  "court-case-subsequent-disposal-results": "Sentence Deferred"
}

const verifyRequests = (bichard: LedsBichard, serverMocks: RequestResponseMock[]) => {
  const localMocks = bichard.policeApi.mocks

  serverMocks.forEach((serverMock, index) => {
    const localMock = localMocks[index]

    if (!localMock.expectedRequest) {
      return
    }

    const match = Object.entries(pathMapping).find(([key]) => serverMock.path.includes(key))

    if (match) {
      const [_, operation] = match
      const localMockRequest = convertPncToLeds<typeof operation>(localMock.expectedRequest, operation)
      const serverMockRequest = serverMock.request?.[0]?.body

      expect(normaliseForComparison(serverMockRequest)).toEqual(normaliseForComparison(localMockRequest))
    }
  })
}

const checkMocksForLedsMockApi = async (bichard: LedsBichard) => {
  let serverMocks: RequestResponseMock[] | undefined = undefined
  let expectationPaths: string[] = []

  for (let index = 0; index < MAX_RETRIES; index++) {
    serverMocks = await bichard.policeApi.mockServerClient.fetchMocks()
    const isReady = serverMocks.length > 0 && serverMocks.every((mock) => mock.request && mock.request.length > 0)

    if (isReady) {
      verifyRequests(bichard, serverMocks)
      return
    }

    console.log(`Attempt ${index + 1}: mocks not ready yet, retrying..`)
    await delay(DELAY_SECONDS)
  }

  if (!serverMocks || serverMocks.length === 0) {
    throw Error(`Couldn't fetch mocks after ${MAX_RETRIES} attempts.`)
  }

  const unusedMocks = await bichard.policeApi.mockServerClient.retrieveUnusedMocks()
  expectationPaths = unusedMocks.map((unusedMock) => unusedMock.path)

  throw Error(["Mocks not called:", ...expectationPaths].join("\n"))
}

export default checkMocksForLedsMockApi
