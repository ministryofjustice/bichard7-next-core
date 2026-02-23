import expect from "expect"
import type { LedsBichard } from "../../types/LedsMock"
import type { Operation } from "../converters/convertPncToLeds"
import convertPncToLeds from "../converters/convertPncToLeds"
import { sanitiseLocalMockRequest, sanitiseServerMockRequest } from "../sanitiseMockRequest"

const verifyRequests = async (bichard: LedsBichard) => {
  const serverMocks = await bichard.policeApi.mockServerClient.fetchMocks()
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

      expect(sanitiseServerMockRequest(serverMockRequest)).toEqual(sanitiseLocalMockRequest(localMockRequest))
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
