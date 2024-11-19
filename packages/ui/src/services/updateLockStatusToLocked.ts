import type { EntityManager, FindOperator, Repository, UpdateResult } from "typeorm"

import { type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import getAuditLogEvent from "@moj-bichard7/core/lib/getAuditLogEvent"
import { IsNull, MoreThan } from "typeorm"
import { isError } from "types/Result"

import type User from "./entities/User"

import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import CourtCase from "./entities/CourtCase"

type LockReason = "Exception" | "Trigger"
type WhereClause<T> = {
  [P in keyof T]?: FindOperator<T[P]> | T[P]
}

const getUpdateQueryClauses = (lockReason: LockReason, courtCaseId: number, user: User) => {
  const setClause: Partial<CourtCase> = {}
  const whereClause: WhereClause<CourtCase> = { errorId: courtCaseId }

  if (lockReason === "Exception") {
    setClause.errorLockedByUsername = user.username
    whereClause.errorLockedByUsername = IsNull()
    whereClause.errorCount = MoreThan(0)
    whereClause.errorStatus = "Unresolved"
  } else {
    setClause.triggerLockedByUsername = user.username
    whereClause.triggerLockedByUsername = IsNull()
    whereClause.triggerCount = MoreThan(0)
    whereClause.triggerStatus = "Unresolved"
  }

  return [setClause, whereClause] as const
}

const lock = async (
  lockReason: LockReason,
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<Error | UpdateResult> => {
  const [setClause, whereClause] = getUpdateQueryClauses(lockReason, courtCaseId, user)

  const result = await courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set(setClause)
    .andWhere(whereClause)
    .execute()
    .catch((error: Error) => error)

  if (!result) {
    return new Error(`Failed to lock ${lockReason}`)
  }

  if (isError(result)) {
    return result
  }

  if (result.affected && result.affected > 0) {
    events.push(
      getAuditLogEvent(
        lockReason === "Exception" ? EventCode.ExceptionsLocked : EventCode.TriggersLocked,
        EventCategory.information,
        AUDIT_LOG_EVENT_SOURCE,
        {
          auditLogVersion: 2,
          user: user.username
        }
      )
    )
  }

  return result
}

const updateLockStatusToLocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<Error | UpdateResult> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  let result: Error | undefined | UpdateResult

  if (user.hasAccessTo[Permission.Exceptions]) {
    result = await lock("Exception", courtCaseRepository, courtCaseId, user, events)
  }

  if (user.hasAccessTo[Permission.Triggers]) {
    result = await lock("Trigger", courtCaseRepository, courtCaseId, user, events)
  }

  return result ?? new Error("update requires a lock (exception or trigger) to update")
}

export default updateLockStatusToLocked
