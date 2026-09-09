import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"
import { isServiceUser, userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { TransactionConnection } from "../../../types/DatabaseGateway"

import selectMessageId from "../../../services/db/cases/selectMessageId"
import unlockException from "../../../services/db/cases/unlockException"
import unlockTrigger from "../../../services/db/cases/unlockTrigger"
import { ForbiddenError } from "../../../types/errors/ForbiddenError"
import buildAuditLogEvent from "../../auditLog/buildAuditLogEvent"
import createAuditLogEvents from "../../createAuditLogEvents"

const appendAuditLogEvent = (
  auditLogEvents: ApiAuditLogEvent[],
  eventSource: string,
  user: User,
  eventCode: EventCode
) => {
  auditLogEvents.push(
    buildAuditLogEvent(eventCode, EventCategory.information, eventSource, {
      auditLogVersion: 2,
      user: user.username
    })
  )
}

export const unlockAndAuditLog = async (
  tx: TransactionConnection,
  user: User,
  caseId: number,
  unlockReason: UnlockReason,
  auditLogGateway: AuditLogDynamoGateway,
  logger: FastifyBaseLogger,
  eventSource: string = "Bichard New UI"
): PromiseResult<void> => {
  const auditLogEvents: ApiAuditLogEvent[] = []
  if (isServiceUser(user)) {
    return new ForbiddenError("Service user does not have permission to unlock triggers or exceptions")
  }

  const canUnlockTriggers = userAccess(user)[Permission.Triggers]
  const canUnlockExceptions = userAccess(user)[Permission.Exceptions]

  const wantsToUnlockTriggers =
    unlockReason === UnlockReason.Trigger || unlockReason === UnlockReason.TriggerAndException

  const wantsToUnlockExceptions =
    unlockReason === UnlockReason.Exception || unlockReason === UnlockReason.TriggerAndException

  if (wantsToUnlockTriggers && wantsToUnlockExceptions) {
    if (!(canUnlockExceptions && canUnlockTriggers)) {
      return new ForbiddenError("User does not have permission to unlock triggers and exceptions")
    }
  }

  if (wantsToUnlockExceptions) {
    if (!canUnlockExceptions) {
      return new ForbiddenError("User does not have permission to unlock exceptions")
    }
  }

  if (wantsToUnlockTriggers) {
    if (!canUnlockTriggers) {
      return new ForbiddenError("User does not have permission to unlock triggers")
    }
  }

  const caseMessageId = await selectMessageId(tx, user, caseId)
  if (isError(caseMessageId)) {
    throw caseMessageId
  }

  if (wantsToUnlockExceptions) {
    const exceptionUnlockedResult = await unlockException(tx, user, caseId)
    if (isError(exceptionUnlockedResult)) {
      return exceptionUnlockedResult
    }

    if (exceptionUnlockedResult) {
      appendAuditLogEvent(auditLogEvents, eventSource, user, EventCode.ExceptionsUnlocked)
    }
  }

  if (wantsToUnlockTriggers) {
    const triggerUnlockedResult = await unlockTrigger(tx, user, caseId)
    if (isError(triggerUnlockedResult)) {
      return triggerUnlockedResult
    }

    if (triggerUnlockedResult) {
      appendAuditLogEvent(auditLogEvents, eventSource, user, EventCode.TriggersUnlocked)
    }

    if (auditLogEvents.length > 0) {
      const auditLogEventsResult = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
      if (isError(auditLogEventsResult)) {
        throw auditLogEventsResult
      }
    }
  }
}
