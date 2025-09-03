import expect from "expect"
import fs from "fs"
import type PncHelper from "../../types/PncHelper"
import type { PncBichard } from "../../types/PncMock"

const expectNotUpdated = async (
  bichard: PncBichard,
  pncHelper: PncHelper,
  skipPNCValidation: boolean
): Promise<void> => {
  // Wait 3 seconds to give the backend time to process
  await new Promise((resolve) => setTimeout(resolve, 3000))
  if (bichard.config.realPNC) {
    if (skipPNCValidation) {
      return
    }

    const result = await pncHelper.checkRecord()
    const before = fs.readFileSync(`${bichard.specFolder}/pnc-data.before.xml`).toString().trim()
    const after = fs.readFileSync(`${bichard.specFolder}/pnc-data.after.xml`).toString().trim()
    expect(result).toBeTruthy()
    expect(before).toEqual(after)
    return
  }

  let mockCount = 0
  const updateMocks = bichard.policeApi.mocks.filter(
    (mock) => mock.matchRegex.startsWith("CXU") && !mock.response.match(/<TXT>/)
  )
  const mockResponsePromises = updateMocks.map(({ id }) => pncHelper.getMock(id))
  const mockResponses = await Promise.all(mockResponsePromises)
  mockResponses.forEach((mock) => {
    expect(mock.requests).toHaveLength(0)
    mockCount += 1
  })

  expect(mockCount).toEqual(updateMocks.length)
}

export default expectNotUpdated
