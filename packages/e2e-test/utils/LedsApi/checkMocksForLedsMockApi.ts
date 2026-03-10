import expect from "expect"
import type { LedsBichard } from "../../types/LedsMock"
import type { Operation } from "../converters/convertPncToLeds"
import convertPncToLeds from "../converters/convertPncToLeds"
import normaliseForComparison from "../normaliseForComparison"
import { delay } from "../puppeteer-utils"
import type { RequestResponseMock } from "./MockServer"

const verifyRequests = async (bichard: LedsBichard) => {
  const MAX_RETRIES = 8
  const DELAY_SECONDS = 3

  let serverMocks: RequestResponseMock[] | undefined = undefined

  for (let index = 0; index < MAX_RETRIES; index++) {
    const fetched = await bichard.policeApi.mockServerClient.fetchMocks()
    const isReady = fetched.length > 0 && fetched.every((mock) => mock.request && mock.request.length > 0)

    if (isReady) {
      serverMocks = fetched
      break
    }

    console.log(`Attempt ${index + 1}: mocks not ready yet, retrying..`)
    await delay(DELAY_SECONDS)
  }

  if (!serverMocks || serverMocks.length === 0) {
    throw Error(`Couldn't fetch mocks after ${MAX_RETRIES} attempts.`)
  }

  const localMocks = bichard.policeApi.mocks

  serverMocks.forEach((serverMock, index) => {
    const localMock = localMocks[index]
    if (!localMock.expectedRequest) {
      return
    }

    const pathMapping: Record<string, Operation> = {
      "court-case-disposal-result": "Add Disposal",
      "basic-remands": "Remand",
      "court-case-subsequent-disposal-results": "Sentence Deferred"
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
  let expectationPaths: string[] = []
  for (let index = 0; index < 3; index++) {
    const unusedMocks = await bichard.policeApi.mockServerClient.retrieveUnusedMocks()
    if (unusedMocks.length === 0) {
      await verifyRequests(bichard)
      return
    }

    expectationPaths = unusedMocks.map((unusedMock) => unusedMock.path)

    await new Promise((resolve) => setTimeout(resolve, 2_000))
  }

  throw Error(["Mocks not called:", ...expectationPaths].join("\n"))
}

export default checkMocksForLedsMockApi
