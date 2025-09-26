import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import AuditLogEvent from "types/AuditLogEvent"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import logger from "utils/logger"
import addPasswordHistory from "./addPasswordHistory"
import checkPassword from "./checkPassword"
import checkPasswordIsBanned from "./checkPasswordIsBanned"
import checkPasswordIsNew from "./checkPasswordIsNew"
import getUserLoginDetailsByEmailAddress from "./getUserLoginDetailsByEmailAddress"
import passwordDoesNotContainSensitive from "./passwordDoesNotContainSensitive"
import passwordSecurityCheck from "./passwordSecurityCheck"
import sendPasswordChangedEmail from "./sendPasswordChangedEmail"
import updatePassword from "./updatePassword"

export default async (
  connection: Database,
  auditLogger: AuditLogger,
  emailAddress: string,
  currentPassword: string,
  newPassword: string,
  baseUrl: string
): PromiseResult<void> => {
  const passwordCheckResult = passwordSecurityCheck(newPassword)

  if (isError(passwordCheckResult)) {
    return passwordCheckResult
  }

  const passwordIsBanned = checkPasswordIsBanned(newPassword)

  if (isError(passwordIsBanned)) {
    return passwordIsBanned
  }

  const validatePasswordSensitveResult = await passwordDoesNotContainSensitive(connection, newPassword, emailAddress)

  if (isError(validatePasswordSensitveResult)) {
    return validatePasswordSensitveResult
  }

  const passwordMatch = await checkPassword(connection, emailAddress, currentPassword)

  if (isError(passwordMatch)) {
    logger.error(passwordMatch)
    return Error("Server error. Please try again later.")
  }

  if (!passwordMatch) {
    return Error("Your current password is incorrect.")
  }

  const getUserResult = await getUserLoginDetailsByEmailAddress(connection, emailAddress)
  if (isError(getUserResult)) {
    return getUserResult
  }

  const result = await connection
    .task("update-and-store-old-password", async (taskConnection) => {
      const addHistoricalPassword = await addPasswordHistory(taskConnection, getUserResult.id, getUserResult.password)

      if (isError(addHistoricalPassword)) {
        return addHistoricalPassword
      }

      const checkPasswordIsNewResult = await checkPasswordIsNew(taskConnection, getUserResult.id, newPassword)

      if (isError(checkPasswordIsNewResult)) {
        return Error("Cannot use previously used password.")
      }

      const updatePasswordResult = await updatePassword(taskConnection, emailAddress, newPassword)

      if (isError(updatePasswordResult)) {
        logger.error(updatePasswordResult)
        return Error("Server error. Please try again later.")
      }

      await auditLogger.logEvent(AuditLogEvent.passwordUpdated)

      const sendPasswordChangedEmailResult = await sendPasswordChangedEmail(connection, emailAddress, baseUrl)

      if (isError(sendPasswordChangedEmailResult)) {
        logger.error(sendPasswordChangedEmailResult)
      }

      return undefined
    })
    .catch((error) => {
      return error
    })

  return result
}
