import { SMTP } from "@/config"
import type Emailer from "@/types/Emailer"
import getFormattedDateForEmailHeader from "@/utils/getFormattedDateForEmailHeader"
import nodemailer from "nodemailer"
import type Email from "types/Email"

import logger from "utils/logger"

const getSmtpMailer = (): Emailer => {
  const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.tls,
    auth: {
      user: SMTP.user,
      pass: SMTP.password
    }
  })

  return {
    sendMail: (email: Email) =>
      transporter.sendMail({
        date: getFormattedDateForEmailHeader(),
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
      date: getFormattedDateForEmailHeader()
    })
  }
})

let emailer: Emailer

export default function getEmailer(emailAddress: string): Emailer {
  if (SMTP.host !== "console" && emailAddress.match(/example\.com(\.cjsm\.net)?$/i)) {
    logger.error("Would have sent an actual email to an example.com email address! Printing to console instead.")
    return getConsoleMailer()
  }

  if (emailer) {
    return emailer
  }

  emailer = SMTP.host === "console" ? getConsoleMailer() : getSmtpMailer()
  return emailer
}
