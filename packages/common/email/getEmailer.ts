import nodemailer from "nodemailer"

import type Email from "./Email"
import type Emailer from "./Emailer"

export interface SmtpConfig {
  debug: boolean
  host: string
  password: string
  port: number
  tls: boolean
  user: string
}

const getSmtpMailer = (config: SmtpConfig): Emailer =>
  nodemailer.createTransport({
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

const getConsoleMailer = (): Emailer => ({
  // eslint-disable-next-line require-await
  sendMail: async (email: Email) => {
    console.log({
      body: email.text,
      from: email.from,
      subject: email.subject,
      to: email.to
    })
    if (email.attachments) {
      email.attachments.forEach((a) => console.log(a))
    }
  }
})

let emailer: Emailer

export default function getEmailer(config: SmtpConfig): Emailer {
  if (emailer) {
    return emailer
  }

  emailer = config.host === "console" ? getConsoleMailer() : getSmtpMailer(config)
  return emailer
}
