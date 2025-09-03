import type PncHelper from "../../types/PncHelper"
import type { PncBichard } from "../../types/PncMock"

const exportValidRecord = async (bichard: PncBichard, pncHelper: PncHelper, recordId: string): Promise<void> => {
  if (bichard.config.realPNC) {
    return
  }

  bichard.recordId = recordId

  bichard.policeApi.mocks = (await import(`${bichard.specFolder}/${recordId.replace(/[ ]+/g, "_")}`)).default

  const mockPromises = bichard.policeApi.mocks.map((mock) => pncHelper.addMock(mock.matchRegex, mock.response))
  const mockIds = await Promise.all(mockPromises)
  for (let i = 0; i < bichard.policeApi.mocks.length; i += 1) {
    const mockId = mockIds[i]
    if (!mockId) {
      throw new Error("Failed to set up mock PNC request")
    }

    bichard.policeApi.mocks[i].id = mockId
  }
}

export default exportValidRecord
