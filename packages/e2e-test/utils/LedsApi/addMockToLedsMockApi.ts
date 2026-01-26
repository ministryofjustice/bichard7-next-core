import type { LedsBichard, LedsMock } from "../../types/LedsMock"
import type Bichard from "../world"

type MockRequestsAndResponses = (ncmFile: string, bichard: Bichard) => LedsMock[]

const addMockToLedsMockApi = async (bichard: LedsBichard): Promise<void> => {
  const mockRequestsAndResponses: MockRequestsAndResponses = (await import(`${bichard.specFolder}/mock-pnc-responses`))
    .default

  bichard.policeApi.mocks = mockRequestsAndResponses(`${bichard.specFolder}/pnc-data.xml`, bichard)

  await bichard.policeApi.mockServerClient.clear()

  for (const mock of bichard.policeApi.mocks) {
    await bichard.policeApi.mockServerClient.addMock({
      path: mock.request.path as unknown as string,
      method: mock.request.method as "GET" | "POST",
      count: mock.count,

      response: {
        status: mock.response.statusCode as number,
        body: mock.response.body as {},
        headers: mock.response.headers as {}
      }
      // id: mock.id
    })
  }
}

export default addMockToLedsMockApi
