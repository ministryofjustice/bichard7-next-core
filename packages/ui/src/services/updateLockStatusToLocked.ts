import { type AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCategory"
import EventCode from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/core/lib/getAuditLogEvent"
import type { EntityManager, FindOperator, Repository, UpdateResult } from "typeorm"
import { IsNull, MoreThan } from "typeorm"
import Permission from "types/Permission"
import { isError } from "types/Result"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import CourtCase from "./entities/CourtCase"
import type User from "./entities/User"

type LockReason = "Trigger" | "Exception"
type WhereClause<T> = {
  [P in keyof T]?: T[P] | FindOperator<T[P]>
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
): Promise<UpdateResult | Error> => {
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
          user: user.username,
          auditLogVersion: 2
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
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  let result: UpdateResult | Error | undefined

  if (user.hasAccessTo[Permission.Exceptions]) {
    result = await lock("Exception", courtCaseRepository, courtCaseId, user, events)
  }

  if (user.hasAccessTo[Permission.Triggers]) {
    result = await lock("Trigger", courtCaseRepository, courtCaseId, user, events)
  }

  return result ?? new Error("update requires a lock (exception or trigger) to update")
}

export default updateLockStatusToLocked
