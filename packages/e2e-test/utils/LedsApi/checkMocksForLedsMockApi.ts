import expect from "expect"
import type { LedsBichard } from "../../types/LedsMock"
import convertPncToLeds from "../converters/convertPncToLeds"

const verifyRequests = async (bichard: LedsBichard) => {
  const serverMocks = await bichard.policeApi.mockServerClient.fetchMocks()
  const localMocks = bichard.policeApi.mocks

  console.log("**** SERVER MOCKS", JSON.stringify(serverMocks, null, 2))
  console.log("**** LOCAL MOCKS", JSON.stringify(localMocks, null, 2))

  for (let index = 0; index < localMocks.length; index++) {
    const localMock = localMocks[index]
    if (!localMock.expectedRequest) {
      continue
    }

    const serverMock = serverMocks[index]
    console.log("SERVER REQ:", serverMock.request)
    console.log("LOCAL  REQ:", localMock.expectedRequest)

    if (serverMock.path.includes("court-case-disposal-result")) {
      const request = convertPncToLeds(localMock.expectedRequest, "Add Disposal")
      expect(serverMock.request).toEqual(request)
    }
  }
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
