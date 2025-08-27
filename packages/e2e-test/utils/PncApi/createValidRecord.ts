import path from "path"
import type PncHelper from "../../types/PncHelper"
import type Bichard from "../world"

const exportValidRecord = async (bichard: Bichard, pncHelper: PncHelper, recordId: string): Promise<void> => {
  if (bichard.config.realPNC) {
    return
  }

  bichard.recordId = recordId

  const specFolder = path.dirname(bichard.featureUri)
  bichard.mocks = require(`../${specFolder}/${recordId.replace(/[ ]+/g, "_")}`)

  const mockPromises = bichard.mocks.map((mock) => pncHelper.addMock(mock.matchRegex, mock.response))
  const mockIds = await Promise.all(mockPromises)
  for (let i = 0; i < bichard.mocks.length; i += 1) {
    const mockId = mockIds[i]
    if (!mockId) {
      throw new Error("Failed to set up mock PNC request")
    }

    bichard.mocks[i].id = mockId
  }
}

export default exportValidRecord
