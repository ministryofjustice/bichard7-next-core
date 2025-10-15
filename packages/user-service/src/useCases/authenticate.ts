import type { ITask } from "pg-promise"
import config from "lib/config"
import type Database from "types/Database"
import type AuditLogger from "types/AuditLogger"
import { verifySsha } from "lib/ssha"
import { verifyPassword } from "lib/argon2"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import resetUserVerificationCode from "./resetUserVerificationCode"
import updatePassword from "./updatePassword"
import getFailedPasswordAttempts from "./getFailedPasswordAttempts"
import setFailedPasswordAttempts from "./setFailedPasswordAttempts"
import type UserAuthBichard from "types/UserAuthBichard"
import type UserGroup from "types/UserGroup"
import AuditLogEvent from "types/AuditLogEvent"

const fetchGroups = async (task: ITask<unknown>, emailAddress: string): Promise<UserGroup[]> => {
  const fetchGroupsQuery = `
      SELECT g.name
      FROM br7own.groups g
      INNER JOIN br7own.users_groups ug
        ON g.id = ug.group_id
      INNER JOIN br7own.users u
        ON ug.user_id = u.id
      WHERE LOWER(u.email) = LOWER($1) AND u.deleted_at IS NULL
    `
  let groups = await task.any(fetchGroupsQuery, [emailAddress])
  groups = groups.map((group: { name: string }) => group.name.replace(/_grp$/, ""))
  return groups
}

export const getUserWithInterval = async (task: ITask<unknown>, params: unknown[]): Promise<UserAuthBichard> => {
  const getUserQuery = `
  SELECT
    id,
    username,
    visible_courts,
    visible_forces,
    excluded_triggers,
    endorsed_by,
    org_serves,
    forenames,
    surname,
    email,
    password,
    email_verification_code,
    email_verification_generated > NOW() - INTERVAL '$3 minutes' as email_verification_current,
    last_login_attempt is not null and last_login_attempt > NOW() - INTERVAL '$2 seconds' as login_too_soon,
    migrated_password,
    deleted_at
  FROM br7own.users
  WHERE LOWER(email) = LOWER($1)`

  const user = await task.one(getUserQuery, params)

  let inclusionList: string[] = []
  if (user.visible_courts) {
    inclusionList = inclusionList.concat(user.visible_courts.split(/[, ]/))
  }

  if (user.visible_forces) {
    inclusionList = inclusionList.concat(user.visible_forces.split(/[, ]/))
  }

  return {
    id: user.id,
    username: user.username,
    exclusionList: user.excluded_triggers ? user.excluded_triggers.split(/[, ]/) : [],
    inclusionList,
    emailAddress: user.email,
    password: user.password,
    emailVerificationCode: user.email_verification_code,
    emailVerificationCurrent: user.email_verification_current,
    loginTooSoon: user.login_too_soon,
    migratedPassword: user.migrated_password,
    groups: await fetchGroups(task, user.email),
    deletedAt: user.deleted_at
  }
}

export const updateUserLoginTimestamp = async (task: ITask<unknown>, emailAddress: string) => {
  const updateUserQuery = `
      UPDATE br7own.users
      SET last_login_attempt = NOW()
      WHERE LOWER(email) = LOWER($1)
    `

  await task.none(updateUserQuery, [emailAddress])
}

const authenticate = async (
  connection: Database,
  auditLogger: AuditLogger,
  emailAddress: string,
  password: string,
  verificationCode: string | null
): PromiseResult<UserAuthBichard> => {
  const invalidCredentialsError = new Error("Invalid credentials or invalid verification")

  if (!emailAddress || !password || (verificationCode && verificationCode.length !== config.verificationCodeLength)) {
    return invalidCredentialsError
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

    if (user.loginTooSoon) {
      return new Error("User has tried to log in too soon")
    }

    if (user.deletedAt) {
      return new Error("User is deleted")
    }

    let isAuthenticated = false

    if (verificationCode && !user.emailVerificationCurrent) {
      return new Error("Email verification code is not current")
    }

    if (!user.password && user.migratedPassword) {
      isAuthenticated = verifySsha(password, user.migratedPassword)

      if (isAuthenticated) {
        await updatePassword(connection, user.emailAddress, password)
      }
    } else {
      isAuthenticated = await verifyPassword(password, user.password)
    }

    const isVerified = verificationCode === user.emailVerificationCode

    if (isAuthenticated && (verificationCode === null || isVerified)) {
      await resetUserVerificationCode(connection, emailAddress)
      await auditLogger.logEvent(AuditLogEvent.loggedIn, { user })
      return user
    }

    if (!isAuthenticated) {
      const attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
      if (isError(attemptsSoFar)) {
        throw attemptsSoFar
      }

      if (attemptsSoFar + 1 >= config.maxPasswordFailedAttempts) {
        await resetUserVerificationCode(connection, emailAddress)
      }

      await setFailedPasswordAttempts(connection, emailAddress, attemptsSoFar + 1)
    }

    return invalidCredentialsError
  } catch (error) {
    if (error instanceof Error && error.message === "No data returned from the query.") {
      return new Error("User not found")
    }

    return error as Error
  }
}

export default authenticate
