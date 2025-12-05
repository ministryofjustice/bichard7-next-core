import type PncHelper from "../../types/PncHelper"
import type { PncBichard } from "../../types/PncMock"
import { isError } from "../isError"

const fetchMocks = async (bichard: PncBichard, pncHelper: PncHelper): Promise<void> => {
  const mockResponsePromises = bichard.policeApi.mocks.map(({ id }) => pncHelper.awaitMockRequest(id, 40000))
  const mockResponses = await Promise.all(mockResponsePromises)

  for (const [i, mock] of bichard.policeApi.mocks.entries()) {
    const fetchedMock = mockResponses[i]
    if (isError(fetchedMock)) {
      throw fetchedMock
    }

    mock.requests = fetchedMock.requests || []
  }
}

export default fetchMocks
