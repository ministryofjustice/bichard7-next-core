import type PncHelper from "../../types/PncHelper"
import { isError } from "../isError"
import type Bichard from "../world"

const fetchMocks = async (bichard: Bichard, pncHelper: PncHelper): Promise<void> => {
  const mockResponsePromises = bichard.mocks.map(({ id }) => pncHelper.awaitMockRequest(id, 40000))
  const mockResponses = await Promise.all(mockResponsePromises)

  for (let i = 0; i < bichard.mocks.length; i += 1) {
    const mock = mockResponses[i]
    if (isError(mock)) {
      console.log(`Failed to fetch mock requests for mock ${i}`)
      console.log(JSON.stringify(bichard.mocks[i], null, 2))
      throw mock
    }

    bichard.mocks[i].requests = mock.requests || []
  }
}

export default fetchMocks
