import type PncHelper from "../../types/PncHelper"
import type PncMock from "../../types/PncMock"
import type { PncBichard } from "../../types/PncMock"

const addMockToPncEmulator = async (bichard: PncBichard, pncHelper: PncHelper): Promise<void> => {
  const mocks = await import(`${bichard.specFolder}/mock-pnc-responses`)
  bichard.policeApi.mocks = mocks.default(`${bichard.specFolder}/pnc-data.xml`, bichard) as PncMock[]

  for (const mock of bichard.policeApi.mocks) {
    if (bichard.config.parallel) {
      const asnID = bichard.currentProsecutorReference[0][1].substring(
        bichard.currentProsecutorReference[0][1].length - 7
      )
      mock.matchRegex = `${mock.matchRegex}.+${asnID}`
    }

    const mockId = await pncHelper.addMock(mock.matchRegex, mock.response, mock.count)
    if (!mockId) {
      throw new Error("Failed to create mock PNC request")
    }

    mock.id = mockId
  }
}

export default addMockToPncEmulator
