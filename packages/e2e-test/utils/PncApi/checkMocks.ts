import expect from "expect"
import fs from "fs"
import type PncHelper from "../../types/PncHelper"
import type { PncBichard } from "../../types/PncMock"
import { isError } from "../isError"
import Poller from "../Poller"
import { updateExpectedRequest } from "../tagProcessing"
import fetchMocks from "./fetchMocks"

const skipPncValidation = process.env.SKIP_PNC_VALIDATION === "true"

const checkMocksForRealPnc = async (bichard: PncBichard, pncHelper: PncHelper): Promise<void> => {
  if (skipPncValidation) {
    return
  }

  const action = (): Promise<boolean> => pncHelper.checkRecord()

  const condition = (result: boolean) => {
    if (result) {
      const before = fs.readFileSync(`${bichard.specFolder}/pnc-data.before.xml`).toString().trim()
      const after = fs.readFileSync(`${bichard.specFolder}/pnc-data.after.xml`).toString().trim()
      if (before === after) {
        return false
      }
    }

    return result
  }

  const options = {
    condition,
    timeout: 10000,
    delay: 250,
    name: "Mock PNC request poller"
  }
  const result = await new Poller<boolean>(action)
    .poll(options)
    .then((res) => res)
    .catch((error) => error)
  expect(isError(result)).toBeFalsy()
  expect(result).toBeTruthy()
}

const checkMocksForPncEmulator = async (bichard: PncBichard, pncHelper: PncHelper): Promise<void> => {
  await fetchMocks(bichard, pncHelper)
  expect(bichard.policeApi.mocks.length).toBeGreaterThan(0)

  let mockCount = 0
  bichard.policeApi.mocks.forEach((mock) => {
    if (mock.expectedRequest !== "") {
      if (mock.requests.length === 0) {
        throw new Error(`Mock not called for ${mock.matchRegex}`)
      }

      if (bichard.config.parallel) {
        expect(mock.requests.length).toBeGreaterThanOrEqual(1)
        const expectedRequest = updateExpectedRequest(mock.expectedRequest, bichard)
        let matchFound = "No request matched the expected request"
        for (const request of mock.requests) {
          if (request.includes(expectedRequest)) {
            matchFound = "Yes"
            break
          }
        }

        expect(matchFound).toBe("Yes")
      } else {
        const { expectedRequest } = mock
        expect(mock.requests).toHaveLength(1)
        expect(mock.requests[0]).toMatch(expectedRequest)
      }
    }

    mockCount += 1
  })

  expect(mockCount).toEqual(bichard.policeApi.mocks.length)
}

export { checkMocksForPncEmulator, checkMocksForRealPnc }
