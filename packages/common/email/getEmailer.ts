import nodemailer from "nodemailer"

import type Email from "./Email"
import type Emailer from "./Emailer"

import getFormattedDateForEmailHeader from "../utils/getFormattedDateForEmailHeader"

export interface Logger {
  error: (message: unknown) => void
  info: (message: unknown) => void
}

export interface SmtpConfig {
  debug?: boolean
  host: string
  password?: string
  port: number
  tls: boolean
  user?: string
}

const getSmtpMailer = (config: SmtpConfig): Emailer => {
  const transporter = nodemailer.createTransport({
    auth: {
      pass: config.password,
      user: config.user
    },
    debug: config.debug,
    host: config.host,
    logger: config.debug,
    port: config.port,
    secure: config.tls
  })

  return {
    sendMail: (email: Email) =>
      transporter.sendMail({
        date: getFormattedDateForEmailHeader(),
        ...email
      })
  }
}

const getConsoleMailer = (logger: Logger = console): Emailer => ({
  // eslint-disable-next-line require-await
  sendMail: async (email: Email) => {
    logger.info({
      body: email.text,
      date: getFormattedDateForEmailHeader(),
      from: email.from,
      subject: email.subject,
      to: email.to
    })

    if (email.attachments) {
      email.attachments.forEach((a) => logger.info(a))
    }
  }
})

let emailer: Emailer

export default function getEmailer(config: SmtpConfig, emailAddress?: string, logger: Logger = console): Emailer {
  if (config.host !== "console" && emailAddress?.match(/example\.com(\.cjsm\.net)?$/i)) {
    logger.error("Would have sent an actual email to an example.com email address! Printing to console instead.")
    return getConsoleMailer(logger)
  }

  if (emailer) {
    return emailer
  }

  emailer = config.host === "console" ? getConsoleMailer(logger) : getSmtpMailer(config)
  return emailer
}
