import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"

export function checkUserCanAccessCase(database: DatabaseConnection, user: User) {
  if (userAccess(user)[Permission.ListAllCases]) {
    return database.connection``
  }

  const canAccessTriggers = userAccess(user)[Permission.Triggers]
  const canAccessExceptions = userAccess(user)[Permission.Exceptions]

  if (canAccessTriggers && canAccessExceptions) {
    return database.connection`
      AND (
        el.trigger_status = ${ResolutionStatusNumber.Unresolved} 
        OR el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}
        OR el.trigger_resolved_by = ${user.username} 
        OR elt.resolved_by = ${user.username}
        OR el.error_resolved_by = ${user.username}
      )
    `
  } else if (canAccessTriggers) {
    return database.connection`AND (el.trigger_status = ${ResolutionStatusNumber.Unresolved} OR el.trigger_resolved_by = ${user.username} OR elt.resolved_by = ${user.username})`
  } else if (canAccessExceptions) {
    return database.connection`AND (el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}) OR el.error_resolved_by = ${user.username})`
  }

  return database.connection`AND FALSE`
}
