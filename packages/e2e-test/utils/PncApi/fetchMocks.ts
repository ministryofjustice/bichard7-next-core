import type PncHelper from "../../types/PncHelper"
import { isError } from "../isError"
import type Bichard from "../world"

const fetchMocks = async (bichard: Bichard, pncHelper: PncHelper): Promise<void> => {
  const mockResponsePromises = bichard.mocks.map(({ id }) => pncHelper.awaitMockRequest(id, 40000))
  const mockResponses = await Promise.all(mockResponsePromises)

  for (const [i, mock] of bichard.mocks.entries()) {
    const fetchedMock = mockResponses[i]
    if (isError(fetchedMock)) {
      console.log(`Failed to fetch mock requests for mock ${i}`)
      console.log(JSON.stringify(bichard.mocks[i], null, 2))
      throw fetchedMock
    }

    mock.requests = fetchedMock.requests || []
  }
}

export default fetchMocks
