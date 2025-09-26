import { ITask } from "pg-promise"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import User from "types/User"
import { UserGroupResult } from "types/UserGroup"
import logger from "utils/logger"
import isEmailUnique from "./IsEmailUnique"
import getUserHierarchyGroups from "./getUserHierarchyGroups"
import isUsernameUnique from "./isUsernameUnique"

type InsertUserResult = PromiseResult<{ id: number }>

const insertUser = (task: ITask<unknown>, userDetails: Partial<User>): InsertUserResult => {
  const insertUserQuery = `
      INSERT INTO br7own.users(
        username,
        forenames,
        surname,
        email,
        endorsed_by,
        org_serves,
        visible_courts,
        visible_forces,
        excluded_triggers,
        feature_flags
      )
      VALUES (
        $\{username\},
        $\{forenames\},
        $\{surname\},
        $\{emailAddress\},
        $\{endorsedBy\},
        $\{orgServes\},
        $\{visibleCourts\},
        $\{visibleForces\},
        $\{excludedTriggers\},
        $\{featureFlags\}
      ) RETURNING id;
    `

  return task.one(insertUserQuery, { ...userDetails }).catch((error) => error)
}

const insertUserIntoGroup = async (
  task: ITask<unknown>,
  newUserId: number,
  groups: UserGroupResult[]
): PromiseResult<void> => {
  const groupIds = groups.map((group: UserGroupResult) => group.id)

  const insertGroupQuery = `
    INSERT INTO br7own.users_groups(
      user_id,
      group_id
    )
    SELECT 
      $\{newUserId\} AS user_id,
      g.id
    FROM br7own.groups AS g
      WHERE
        g.id IN ($\{groupIds:csv\});
  `

  const result = await task.result(insertGroupQuery, { newUserId, groupIds }).catch((error) => error as Error)

  if (isError(result)) {
    logger.error(result)
    return result
  }

  return undefined
}

export default async (
  connection: Database,
  currentUser: Partial<User>,
  userDetails: Partial<User>
): PromiseResult<void> => {
  const tmpUserDetails: Partial<User> = {}
  for (const [key, value] of Object.entries(userDetails)) {
    if (typeof value === "string") {
      tmpUserDetails[key] = String(value).trim()
    } else {
      tmpUserDetails[key] = value
    }
  }
  userDetails = tmpUserDetails

  const isUsernameUniqueResult = await isUsernameUnique(connection, userDetails.username as string)
  if (isError(isUsernameUniqueResult)) {
    return isUsernameUniqueResult
  }

  const isEmailUniqueResult = await isEmailUnique(connection, userDetails.emailAddress as string)
  if (isError(isEmailUniqueResult)) {
    return isEmailUniqueResult
  }

  const createUserResult = await connection
    .tx(async (task: ITask<unknown>) => {
      const insertUserResult = await insertUser(task, userDetails)
      if (isError(insertUserResult)) {
        logger.error(insertUserResult)
        return Error("Could not insert record into users table")
      }
      const groups = await getUserHierarchyGroups(connection, currentUser.username ?? "")
      if (isError(groups)) {
        return groups
      }
      const filteredGroups = groups.filter((group) => userDetails[group.name] === "yes")
      const userDetailsWithGroups = { ...userDetails, groups: filteredGroups }
      if (currentUser.id && userDetailsWithGroups.groups && userDetailsWithGroups.groups.length > 0) {
        const userGroupResult = await insertUserIntoGroup(task, insertUserResult.id, userDetailsWithGroups.groups)
        return userGroupResult
      }

      return undefined
    })
    .catch((error) => error)

  if (isError(createUserResult)) {
    logger.error(createUserResult)
    return Error("Could not create user")
  }

  return undefined
}
