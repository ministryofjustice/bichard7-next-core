import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import config from "lib/config"
import nodemailer from "nodemailer"
import type Email from "types/Email"
import type Emailer from "types/Emailer"
import logger from "utils/logger"

const getBSTDate = () => {
  const dateFormat = "yyyy-MM-dd HH:mm:ss"
  const dateObject = new Date()
  const zonedDate = toZonedTime(dateObject, "Europe/London")
  const bstString = format(zonedDate, dateFormat)
  return bstString
}

const getSmtpMailer = (): Emailer => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.tls,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password
    }
  })

  return {
    sendMail: (email: Email) =>
      transporter.sendMail({
        date: getBSTDate(),
        ...email
      })
  }
}

const getConsoleMailer = (): Emailer => ({
  sendMail: async (email: Email) => {
    logger.info({
      from: email.from,
      to: email.to,
      subject: email.subject,
      body: email.text,
      date: getBSTDate()
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
