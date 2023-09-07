import "../../phase1/tests/helpers/setEnvironmentVariables"

import type Email from "@moj-bichard7/common/email/Email"
import * as getEmailer from "@moj-bichard7/common/email/getEmailer"
import MockMailServer from "@moj-bichard7/common/test/MockMailServer"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import { type ErrorReportData } from "../types/errorReportData"
import alertCommonPlatform from "./alertCommonPlatform"

// mock failure of sendEmail function for alertCommonPlatform
const mockGetEmailer = getEmailer as { default: any }
const originalGetEmailer = mockGetEmailer.default

const getEmailerThrowsException = () => ({
  sendMail: jest.fn().mockImplementation(() => {
    throw new Error("Mock error")
  })
})
const getEmailerDefault = (config: getEmailer.SmtpConfig) => ({
  sendMail: (email: Email) => {
    return originalGetEmailer(config).sendMail(email)
  }
})

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
    mockGetEmailer.default = getEmailerThrowsException
    const result = await alertCommonPlatform.execute({
      inputData: {
        errorReportData
      }
    })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result).toHaveProperty("logs", [{ createdTime: expect.any(Number), log: "Mock error" }])
  })

  // HELO errors might mean your hostname isn't acceptable
  // to the SMTP client we use, check you don't have
  // apostrophes
  it("sends an email", async () => {
    mockGetEmailer.default = getEmailerDefault
    const mailServer = new MockMailServer(20002)

    const result = await alertCommonPlatform.execute({
      inputData: {
        errorReportData
      }
    })
    expect(result).toHaveProperty("status", "COMPLETED")
    expect(result).toHaveProperty("logs", [{ createdTime: expect.any(Number), log: "Message sent to Common Platform" }])

    const mail = await mailServer.getEmail("moj-bichard7@madetech.cjsm.net")
    if (isError(mail)) {
      throw mail
    }
    expect(mail.body).toMatch("Received date: 2023-08-31T14:48:00.000Z")
    expect(mail.body).toMatch(`Bichard internal message ID: ${errorReportData.messageId}`)
    expect(mail.body).toMatch(`Common Platform ID: ${errorReportData.externalId}`)
    expect(mail.body).toMatch(`PTIURN: ${errorReportData.ptiUrn}`)

    mailServer.stop()
  })
})
