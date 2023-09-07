import { randomUUID } from "crypto"
import { type ErrorReportData } from "../types/errorReportData"
import alertCommonPlatform from "./alertCommonPlatform"

jest.mock("@moj-bichard7/common/email/getEmailer", () =>
  jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation(() => {
      throw new Error("Mock error")
    })
  })
)

const errorReportData: ErrorReportData = {
  receivedDate: "2023-08-31T14:48:00.000Z",
  messageId: randomUUID(),
  externalId: randomUUID(),
  ptiUrn: "01ZD0303208"
}

describe("alertCommonPlatform", () => {
  it("should fail if errorReportData is not provided", async () => {
    const result = await alertCommonPlatform.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if emailer throws", async () => {
    const result = await alertCommonPlatform.execute({ inputData: { errorReportData } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result).toHaveProperty("logs", [{ createdTime: expect.any(Number), log: "Mock error" }])
  })
})
