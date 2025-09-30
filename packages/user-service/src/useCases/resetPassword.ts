import type AuditLogger from "types/AuditLogger"
import type Database from "types/Database"
import AuditLogEvent from "types/AuditLogEvent"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import addPasswordHistory from "./addPasswordHistory"
import checkPasswordIsBanned from "./checkPasswordIsBanned"
import checkPasswordIsNew from "./checkPasswordIsNew"
import getEmailVerificationCode from "./getEmailVerificationCode"
import getUserLoginDetailsByEmailAddress from "./getUserLoginDetailsByEmailAddress"
import passwordDoesNotContainSensitive from "./passwordDoesNotContainSensitive"
import updatePassword from "./updatePassword"

export interface ResetPasswordOptions {
  emailAddress: string
  passwordResetCode: string
  newPassword: string
}

export default async (
  connection: Database,
  auditLogger: AuditLogger,
  options: ResetPasswordOptions
): PromiseResult<string> => {
  const { emailAddress, passwordResetCode, newPassword } = options

  const passwordIsBanned = checkPasswordIsBanned(newPassword)
  if (isError(passwordIsBanned)) {
    return passwordIsBanned.message
  }

  const userPasswordResetCode = await getEmailVerificationCode(connection, emailAddress)
  if (isError(userPasswordResetCode)) {
    return userPasswordResetCode
  }

  if (passwordResetCode !== userPasswordResetCode) {
    return new Error("Password reset code does not match")
  }

  const validatePasswordSensitveResult = await passwordDoesNotContainSensitive(connection, newPassword, emailAddress)
  if (isError(validatePasswordSensitveResult)) {
    return validatePasswordSensitveResult.message
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
        return "Cannot use previously used password."
      }

      const updatePasswordResult = await updatePassword(taskConnection, emailAddress, newPassword)
      if (isError(updatePasswordResult)) {
        return updatePasswordResult
      }

      await auditLogger.logEvent(AuditLogEvent.passwordReset, { user: { emailAddress } })

      return undefined
    })
    .catch((error) => {
      return error
    })

  return result
}
