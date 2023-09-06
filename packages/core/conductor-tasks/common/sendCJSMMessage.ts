import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import type Email from "@moj-bichard7/common/email/Email"
import getEmailer from "@moj-bichard7/common/email/getEmailer"
import getSmtpConfig from "@moj-bichard7/common/email/getSmtpConfig"

const taskDefName = "send_cjsm_message"

const emailer = getEmailer(getSmtpConfig())

const sendCJSMMessage: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async () => {
    // pull out emails and content from inputs
    // error if no emails provided
    // error if no message provided
    // error if no subject provided

    const email: Email = {
      from: "no-reply@mail.bichard7.service.justice.gov.uk",
      to: "moj-bichard7@madetech.cjsm.net",
      subject: "Hello, Bicharders",
      text: "Content"
    }

    await emailer.sendMail(email)

    // send the email
    return Promise.resolve({
      status: "COMPLETED"
    })
  }
}

export default sendCJSMMessage
