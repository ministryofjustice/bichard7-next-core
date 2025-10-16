import config from "lib/config"
import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import type UserAuthBichard from "../types/UserAuthBichard"
import type { ITask } from "pg-promise"
import { getUserWithInterval, updateUserLoginTimestamp } from "./authenticate"

const validateUserVerificationCode = async (
  connection: Database,
  emailAddress: string,
  verificationCode: string
): PromiseResult<UserAuthBichard> => {
  if (!verificationCode || verificationCode.length !== config.verificationCodeLength) {
    return new Error("Invalid Verification Code ")
  }

  try {
    const user = await connection.tx(async (task: ITask<unknown>) => {
      const u = await getUserWithInterval(task, [
        emailAddress,
        config.incorrectDelay,
        config.emailVerificationExpiresIn
      ])
      await updateUserLoginTimestamp(task, emailAddress)
      return u
    })

    if (user.deletedAt) {
      return new Error("User is deleted")
    }

    const isVerified = verificationCode === user.emailVerificationCode
    const isCurrent = user.emailVerificationCurrent // True if generated time is > NOW() - INTERVAL

    if (isVerified && isCurrent) {
      return user
    }

    return new Error("Invalid Verification Code or Code Expired")
  } catch (error) {
    if (error instanceof Error && error.message === "No data returned from the query.") {
      return new Error("User not found.")
    }

    return error as Error
  }
}

export default validateUserVerificationCode
