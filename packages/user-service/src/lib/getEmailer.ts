import nodemailer from "nodemailer"
import config from "lib/config"
import Email from "types/Email"
import Emailer from "types/Emailer"
import logger from "utils/logger"

const getSmtpMailer = (): Emailer =>
  nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.tls,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password
    }
  })

const getConsoleMailer = (): Emailer => ({
  // eslint-disable-next-line require-await
  sendMail: async (email: Email) => {
    logger.info({
      from: email.from,
      to: email.to,
      subject: email.subject,
      body: email.text
    })
  }
})

let emailer: Emailer

export default function getEmailer(emailAddress: string): Emailer {
  if (config.smtp.host !== "console" && emailAddress.match(/example\.com(\.cjsm\.net)?$/i)) {
    logger.error("Would have sent an actual email to an example.com email address! Printing to console instead.")
    return getConsoleMailer()
  }

  if (emailer) {
    return emailer
  }

  emailer = config.smtp.host === "console" ? getConsoleMailer() : getSmtpMailer()
  return emailer
}
