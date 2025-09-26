import generateEmailChangedEmail from "emails/emailChanged"
import { addCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import type PromiseResult from "types/PromiseResult"
import type User from "types/User"
import logger from "utils/logger"

export default async (
  user: Pick<User, "forenames" | "surname">,
  oldEmail: string,
  newEmail: string
): PromiseResult<void> => {
  const oldEmailContent = generateEmailChangedEmail({ status: "old", user })
  const newEmailContent = generateEmailChangedEmail({ status: "new", user })

  let sendingError: Error | undefined

  await getEmailer(oldEmail)
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(oldEmail),
      ...oldEmailContent
    })
    .then(() => logger.info(`Email successfully sent to ${oldEmail}`))
    .catch((error: Error) => {
      logger.error({ error: error }, `Error sending email to ${oldEmail}`)
      sendingError = error
    })

  await getEmailer(newEmail)
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(newEmail),
      ...newEmailContent
    })
    .then(() => logger.info(`Email successfully sent to ${newEmail}`))
    .catch((error: Error) => {
      logger.error({ error: error }, `Error sending email to ${newEmail}`)
      sendingError = error
    })

  return sendingError
}
