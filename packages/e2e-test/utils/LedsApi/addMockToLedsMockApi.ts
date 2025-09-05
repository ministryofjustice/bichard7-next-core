import type { LedsBichard, LedsMock } from "../../types/LedsMock"
import type Bichard from "../world"

type MockRequestsAndResponses = (ncmFile: string, bichard: Bichard) => LedsMock[]

const addMockToLedsMockApi = async (bichard: LedsBichard): Promise<void> => {
  const mockRequestsAndResponses: MockRequestsAndResponses = (await import(`${bichard.specFolder}/mock-pnc-responses`))
    .default

  bichard.policeApi.mocks = mockRequestsAndResponses(`${bichard.specFolder}/pnc-data.xml`, bichard)

  await bichard.policeApi.mockServerClient.clear("", "ALL")

  for (const mock of bichard.policeApi.mocks) {
    await bichard.policeApi.mockServerClient.mockWithCallback(
      mock.request,
      () => mock.response,
      mock.count,
      undefined,
      undefined,
      mock.id
    )
  }
}

export default addMockToLedsMockApi
