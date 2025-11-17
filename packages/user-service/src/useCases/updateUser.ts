import type AuditLogger from "types/AuditLogger"
import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import type User from "types/User"
import type { ITask } from "pg-promise"
import { isError } from "types/Result"
import type { UserGroupResult } from "types/UserGroup"
import logger from "utils/logger"
import AuditLogEvent from "types/AuditLogEvent"

const deleteFromUsersGroups = (task: ITask<unknown>, userId: number): PromiseResult<null> => {
  const deleteFromUsersGroupsQuery = `
    DELETE FROM br7own.users_groups
    WHERE user_id = $\{userId\}
  `

  return task.none(deleteFromUsersGroupsQuery, { userId }).catch((error) => error as Error)
}

const updateUsersGroup = (
  task: ITask<unknown>,
  userId: number,
  currentUserId: number,
  groupIds: number[]
): PromiseResult<null> => {
  const insertGroupQuery = `
    INSERT INTO br7own.users_groups(
      user_id,
      group_id
    )
    SELECT
      $\{targetUserId\} AS user_id,
      g.id
    FROM br7own.groups AS g
    WHERE
      g.id IN ($\{groupIds:csv\});
  `
  return task.none(insertGroupQuery, { targetUserId: userId, currentUserId, groupIds })
}

const updateUserTable = async (task: ITask<unknown>, userDetails: Partial<User>): PromiseResult<void> => {
  const updateUserQuery = `
    UPDATE br7own.users
	    SET
        forenames=$\{forenames\},
        surname=$\{surname\},
        email=$\{emailAddress\},
        org_serves=$\{orgServes\},
        visible_courts=$\{visibleCourts\},
        visible_forces=$\{visibleForces\},
        excluded_triggers=$\{excludedTriggers\}
	    WHERE id = $\{id\}
    `

  const result = await task.result(updateUserQuery, { ...userDetails })

  if (isError(result) || result.rowCount === 0) {
    logger.error(result)
    return new Error("Could not update user")
  }

  return undefined
}

const updateUser = async (
  connection: Database,
  auditLogger: AuditLogger,
  currentUser: Partial<User>,
  userDetails: Partial<User>
): PromiseResult<void | Error> => {
  const tmpUserDetails: Partial<User> = {}
  for (const [key, value] of Object.entries(userDetails)) {
    if (typeof value === "string") {
      tmpUserDetails[key] = String(value).trim()
    } else {
      tmpUserDetails[key] = value
    }
  }

  userDetails = tmpUserDetails

  const result = await connection.tx(async (task: ITask<unknown>): PromiseResult<void> => {
    const selectedGroups: number[] = userDetails.groups
      ? userDetails.groups.map((group: UserGroupResult) => Number.parseInt(group.id, 10))
      : []
    const userId = userDetails.id as number
    const currentUserId = currentUser.id as number
    const updateUserResult = await updateUserTable(task, userDetails)

    if (isError(updateUserResult)) {
      return new Error("Could not update user")
    }

    const deleteUserGroupsResult = await deleteFromUsersGroups(task, userId)
    if (isError(deleteUserGroupsResult)) {
      logger.error(deleteUserGroupsResult)
      return new Error("Could not delete groups")
    }

    if (selectedGroups.length !== 0) {
      const updateUserGroupsResult = await updateUsersGroup(task, userId, currentUserId, selectedGroups)
      if (isError(updateUserGroupsResult)) {
        logger.error(updateUserGroupsResult)
        return new Error("Could not insert groups")
      }
    }

    return undefined
  })

  if (isError(result)) {
    logger.error(result)
    return new Error("There was an error while updating the user. Please try again.")
  }

  await auditLogger.logEvent(AuditLogEvent.userDetailsEdited, { user: userDetails, by: currentUser })

  return undefined
}

export default updateUser
