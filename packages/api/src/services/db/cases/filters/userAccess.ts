import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

import { ResolutionStatusNumber } from "../../../../useCases/dto/convertResolutionStatus"

export function filterByUserAccess(database: DatabaseConnection, user: User) {
  if (userAccess(user)[Permission.ListAllCases]) {
    return database.connection``
  }

  const triggerHandlerFilter = database.connection`
    (
      (
        SELECT COUNT(*)
        FROM br7own.error_list_triggers T1
        WHERE
          T1.error_id = el.error_id
          AND NOT (T1.trigger_code = ANY (${user.excludedTriggers}))
      ) > 0
      AND (
        el.trigger_status = ${ResolutionStatusNumber.Unresolved} 
        OR el.trigger_resolved_by = ${user.username} 
        OR elt.resolved_by = ${user.username}
      )
    )`

  const exceptionHandlerFilter = database.connection`
    (
      el.error_count > 0 
      AND (
        el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}) 
        OR el.error_resolved_by = ${user.username}
      )
    )`

  const canAccessTriggers = userAccess(user)[Permission.Triggers]
  const canAccessExceptions = userAccess(user)[Permission.Exceptions]

  if (canAccessTriggers && canAccessExceptions) {
    return database.connection`AND (${triggerHandlerFilter} OR ${exceptionHandlerFilter})`
  }

  if (canAccessTriggers) {
    return database.connection`AND ${triggerHandlerFilter}`
  }

  if (canAccessExceptions) {
    return database.connection`AND ${exceptionHandlerFilter}`
  }

  return database.connection`AND FALSE`
}
