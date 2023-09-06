import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type Email from "@moj-bichard7/common/email/Email"
import getEmailer from "@moj-bichard7/common/email/getEmailer"
import getSmtpConfig from "@moj-bichard7/common/email/getSmtpConfig"
import { errorReportDataSchema, type ErrorReportData } from "../types/errorReportData"

const taskDefName = "alert_common_platform"

const emailer = getEmailer(getSmtpConfig())

const generateEmailContent = (
  inputData: ErrorReportData
) => `There was a problem processing the message with the following details:

Received date: ${inputData.receivedDate}
Bichard internal message ID: ${inputData.messageId}
Common Platform ID: ${inputData.externalId}
PTIURN: ${inputData.ptiUrn}
  `

const alertCommonPlatform: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const errorReportData = errorReportDataSchema.safeParse(task.inputData?.errorReportData)
    if (!errorReportData.success) {
      return Promise.resolve({
        logs: [conductorLog("errorReportData is missing or invalid")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    // pull out emails and content from inputs
    // error if no emails provided
    // error if no message provided
    // error if no subject provided

    const email: Email = {
      from: "no-reply@mail.bichard7.service.justice.gov.uk",
      to: "moj-bichard7@madetech.cjsm.net",
      subject: "Failed to ingest SPI message, schema mismatch",
      text: generateEmailContent(errorReportData.data)
    }

    try {
      await emailer.sendMail(email)
    } catch (e) {
      return Promise.resolve({
        status: "FAILED",
        logs: [conductorLog((e as Error).message)]
      })
    }

    // send the email
    return Promise.resolve({
      status: "COMPLETED",
      logs: [conductorLog("Message sent to Common Platform")]
    })
  }
}

export default alertCommonPlatform
