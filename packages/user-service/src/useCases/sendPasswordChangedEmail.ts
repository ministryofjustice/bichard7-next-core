import { addCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import logger from "utils/logger"
import createPasswordChangedEmail from "./createPasswordChangedEmail"
import getUserByEmailAddress from "./getUserByEmailAddress"

export default async (connection: Database, emailAddress: string, baseUrl: string): PromiseResult<void> => {
  const user = await getUserByEmailAddress(connection, emailAddress)

  if (isError(user)) {
    return user
  }

  if (!user) {
    return undefined
  }

  const emailContent = createPasswordChangedEmail(user, baseUrl)

  const emailer = getEmailer(emailAddress)
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(emailAddress),
      ...emailContent
    })
    .then(() => logger.info(`Email successfully sent to ${emailAddress}`))
    .catch((error: Error) => {
      logger.error({ error: error }, `Error sending email to ${emailAddress}`)
      return error
    })
}
