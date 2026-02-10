import crypto from "crypto"

import LedsActionCode from "../../../types/leds/LedsActionCode"
import generateRequestHeaders from "./generateRequestHeaders"

const testInput: Record<LedsActionCode, { activityCode: string; reason: string }> = {
  [LedsActionCode.QueryByAsn]: { reason: "8 - on behalf of an authorised third party", activityCode: "Person Enquiry" },
  [LedsActionCode.AddDisposalResults]: { reason: "9 - Update/Confirm/Broadcast", activityCode: "Person Update" },
  [LedsActionCode.AddRemand]: { reason: "9 - Update/Confirm/Broadcast", activityCode: "Person Update" },
  [LedsActionCode.AddSubsequentDisposalResults]: {
    reason: "9 - Update/Confirm/Broadcast",
    activityCode: "Person Update"
  }
}

describe("generateRequestHeaders", () => {
  let uuidCount = 0

  it.each(Object.keys(testInput))("should generate the request headers for %s", (actionCode) => {
    uuidCount += 1
    const expectedRandomUuid = `Test ID ${uuidCount}`
    const { reason, activityCode } = testInput[actionCode as LedsActionCode]
    const uuidSpy = jest.spyOn(crypto, "randomUUID").mockImplementation(() => {
      return expectedRandomUuid as `${string}-${string}-${string}-${string}-${string}`
    })

    const headers = generateRequestHeaders("dummy-id", actionCode as LedsActionCode, "dummy-auth-token")

    expect(headers).toEqual({
      Authorization: "Bearer dummy-auth-token",
      Accept: "application/json",
      "X-Leds-Session-Id": expectedRandomUuid,
      "X-Leds-System-Name": "Bichard7",
      "X-Leds-Application-Datetime": expect.anything(),
      "X-Leds-Justification": "Automated court disposal from MoJ Bichard",
      "X-Leds-Reason": reason,
      "X-Leds-On-Behalf-Of": "Bichard7",
      "X-Leds-Activity-Flow-Id": expectedRandomUuid,
      "X-Leds-Activity-Code": activityCode,
      "X-Leds-Action-Code": actionCode,
      "X-Leds-Reference-Id": expectedRandomUuid,
      "X-Leds-Correlation-Id": "dummy-id"
    })

    uuidSpy.mockRestore()
  })
})
