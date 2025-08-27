import { resolve } from "path"
import type PncHelper from "../../types/PncHelper"
import type PncMock from "../../types/PncMock"
import type Bichard from "../world"

const setupMockInPncEmulator = async (bichard: Bichard, pncHelper: PncHelper, specFolder: string): Promise<void> => {
  // mock a response in the PNC
  const mocks = await import(resolve(`${specFolder}/mock-pnc-responses`))
  bichard.mocks = mocks.default(resolve(`${specFolder}/pnc-data.xml`), bichard) as PncMock[]

  for (const mock of bichard.mocks) {
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

export default setupMockInPncEmulator
