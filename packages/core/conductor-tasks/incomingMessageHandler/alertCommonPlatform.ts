import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type Email from "@moj-bichard7/common/email/Email"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import getEmailer from "@moj-bichard7/common/email/getEmailer"
import getSmtpConfig from "@moj-bichard7/common/email/getSmtpConfig"
import { z } from "zod"

import { type ErrorReportData, errorReportDataSchema } from "../types/errorReportData"

const inputDataSchema = z.object({
  errorReportData: errorReportDataSchema
})
type InputData = z.infer<typeof inputDataSchema>

const generateEmailContent = (
  inputData: ErrorReportData
) => `There was a problem processing the message with the following details:

Received date: ${inputData.receivedDate}
Bichard internal message ID: ${inputData.messageId}
Common Platform ID: ${inputData.externalId}
PTIURN: ${inputData.ptiUrn}
${inputData.errorMessage}
  `

const alertCommonPlatform: ConductorWorker = {
  taskDefName: "alert_common_platform",
  pollInterval: 10000,
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { errorReportData } = task.inputData

    const email: Email = {
      from: "no-reply@mail.bichard7.service.justice.gov.uk",
      to: process.env.ERROR_REPORT_ADDRESSES ?? "moj-bichard7@madetech.cjsm.net",
      subject: "Failed to ingest SPI message, schema mismatch",
      text: generateEmailContent(errorReportData)
    }

    try {
      const config = getSmtpConfig()
      const emailer = getEmailer(config)
      await emailer.sendMail(email)
    } catch (e) {
      return failed((e as Error).message)
    }

    return completed("Message sent to Common Platform")
  })
}

export default alertCommonPlatform
