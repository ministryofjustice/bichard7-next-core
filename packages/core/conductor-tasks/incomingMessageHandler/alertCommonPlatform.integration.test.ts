jest.setTimeout(9999999)
import "../../phase1/tests/helpers/setEnvironmentVariables"

import type Email from "@moj-bichard7/common/email/Email"
import * as getEmailer from "@moj-bichard7/common/email/getEmailer"
import { randomUUID } from "crypto"
import mailhogClient from "mailhog"
import { type ErrorReportData } from "../types/errorReportData"
import alertCommonPlatform from "./alertCommonPlatform"

const mailhog = mailhogClient()

// mock failure of sendEmail function for alertCommonPlatform
const mockGetEmailer = getEmailer as { default: any }
const originalGetEmailer = mockGetEmailer.default

const getEmailerThrowsException = () => ({
  sendMail: () => {
    throw new Error("Mock error")
  }
})
const getEmailerDefault = (config: getEmailer.SmtpConfig) => ({
  sendMail: (email: Email) => originalGetEmailer(config).sendMail(email)
})

const errorReportData: ErrorReportData = {
  receivedDate: "2023-08-31T14:48:00.000Z",
  messageId: randomUUID(),
  externalId: randomUUID(),
  ptiUrn: "01ZD0303208",
  errorMessage: "Error parsing input message"
}

describe("alertCommonPlatform", () => {
  it("should fail if with terminal error if errorReportData is not provided", async () => {
    const result = await alertCommonPlatform.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected object for errorReportData")
  })

  it("should fail with terminal error if errorReportData is invalid", async () => {
    const result = await alertCommonPlatform.execute({
      inputData: { errorReportData: { ...errorReportData, receivedDate: false } }
    })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "InputData error: Expected string for errorReportData.receivedDate"
    )
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
    await mailhog.deleteAll()
    mockGetEmailer.default = getEmailerDefault

    const result = await alertCommonPlatform.execute({
      inputData: {
        errorReportData
      }
    })
    expect(result).toHaveProperty("status", "COMPLETED")
    expect(result).toHaveProperty("logs", [{ createdTime: expect.any(Number), log: "Message sent to Common Platform" }])

    const allMail = await mailhog.messages()
    expect(allMail).not.toBeNull()
    expect(allMail).toHaveProperty("count", 1)

    const mail = allMail?.items[0]
    expect(mail?.from).toBe("no-reply@mail.bichard7.service.justice.gov.uk")
    expect(mail?.subject).toMatch("Failed to ingest SPI message, schema mismatch")
    expect(mail?.text).toMatch("Received date: 2023-08-31T14:48:00.000Z")
    expect(mail?.text).toMatch(`Bichard internal message ID: ${errorReportData.messageId}`)
    expect(mail?.text).toMatch(`Common Platform ID: ${errorReportData.externalId}`)
    expect(mail?.text).toMatch(`PTIURN: ${errorReportData.ptiUrn}`)
    expect(mail?.text).toMatch(`${errorReportData.errorMessage}`)
  })
})
