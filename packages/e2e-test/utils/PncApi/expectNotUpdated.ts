import expect from "expect"
import fs from "fs"
import path from "path"
import type PncHelper from "../../types/PncHelper"
import type Bichard from "../world"

const expectNotUpdated = async (bichard: Bichard, pncHelper: PncHelper, skipPNCValidation: boolean): Promise<void> => {
  // Wait 3 seconds to give the backend time to process

  await new Promise((resolve) => setTimeout(resolve, 3000))
  if (bichard.config.realPNC) {
    if (skipPNCValidation) {
      return
    }

    const specFolder = path.dirname(bichard.featureUri)
    const result = await pncHelper.checkRecord(specFolder)
    const before = fs.readFileSync(`${specFolder}/pnc-data.before.xml`).toString().trim()
    const after = fs.readFileSync(`${specFolder}/pnc-data.after.xml`).toString().trim()
    expect(result).toBeTruthy()
    expect(before).toEqual(after)
    return
  }

  let mockCount = 0
  const updateMocks = bichard.mocks.filter((mock) => mock.matchRegex.startsWith("CXU") && !mock.response.match(/<TXT>/))
  const mockResponsePromises = updateMocks.map(({ id }) => pncHelper.getMock(id))
  const mockResponses = await Promise.all(mockResponsePromises)
  mockResponses.forEach((mock) => {
    expect(mock.requests).toHaveLength(0)
    mockCount += 1
  })

  expect(mockCount).toEqual(updateMocks.length)
}

export default expectNotUpdated
