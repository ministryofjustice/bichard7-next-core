import { randomDigits } from "crypto-secure-random-digit"
import { addCjsmSuffix, removeCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import logger from "utils/logger"
import storeVerificationCode from "./storeVerificationCode"
import loginEmail from "../emails/login"
import resetPasswordEmail from "../emails/resetPassword"

export default async (connection: Database, emailAddress: string, type: string): PromiseResult<void> => {
  const normalisedEmail = removeCjsmSuffix(emailAddress)

  const code = randomDigits(config.verificationCodeLength).join("")
  const storeResult = await storeVerificationCode(connection, emailAddress, code)

  if (isError(storeResult)) {
    return storeResult
  }

  if (!storeResult) {
    logger.error(`No user found with email address ${emailAddress}`)
    return undefined
  }

  let createVerificationEmailResult
  if (type === "login") {
    createVerificationEmailResult = loginEmail({ code })
  } else {
    createVerificationEmailResult = resetPasswordEmail({ code })
  }

  if (isError(createVerificationEmailResult)) {
    return createVerificationEmailResult
  }

  const emailContent = createVerificationEmailResult

  const emailer = getEmailer(normalisedEmail)
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(normalisedEmail),
      ...emailContent
    })
    .then(() => logger.info(`Email successfully sent to ${emailAddress}`))
    .catch((error: Error) => {
      logger.error({ error: error }, `Error sending email to ${emailAddress}`)
      return error
    })
}
