import type PncHelper from "../../types/PncHelper"
import type { PncBichard } from "../../types/PncMock"
import { isError } from "../isError"

const fetchMocks = async (bichard: PncBichard, pncHelper: PncHelper): Promise<void> => {
  const mockResponsePromises = bichard.policeApi.mocks.map(({ id }) => pncHelper.awaitMockRequest(id, 40000))
  const mockResponses = await Promise.all(mockResponsePromises)

  for (const [i, mock] of bichard.policeApi.mocks.entries()) {
    const fetchedMock = mockResponses[i]
    if (isError(fetchedMock)) {
      console.log(`Failed to fetch mock requests for mock ${i}`)
      console.log(JSON.stringify(bichard.policeApi.mocks[i], null, 2))
      throw fetchedMock
    }

    console.log(`Fetch mock requests for mock: ${mock.id}`)

    mock.requests = fetchedMock.requests || []
  }
}

export default fetchMocks
