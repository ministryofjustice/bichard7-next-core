import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { TransactionConnection, WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchCase from "../../../services/db/cases/fetchCase"
import getSystemNotesForTriggerCodes from "../../../services/db/cases/getSystemNotesForTriggerCodes"
import insertNotes from "../../../services/db/cases/insertNotes"
import selectMessageId from "../../../services/db/cases/selectMessageId"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import createAuditLogEvents from "../../createAuditLogEvents"
import { getAllTriggers } from "../getCase/getAllTriggers"
import { markTriggersAsCompleteAndAuditLog } from "../getCase/markTriggersAsCompleteAndAuditLog"
import { unlockAndAppendAuditEvents } from "../getCase/unlockAndAppendAuditEvents"
import { resolveTriggers } from "./resolveTriggers"

const handleResolvingTriggers = async (
  tx: TransactionConnection,
  user: User,
  courtCaseId: number,
  triggerIds: number[],
  logger: FastifyBaseLogger,
  auditLogEvents: ApiAuditLogEvent[]
) => {
  const courtCase = await fetchCase(tx, user, courtCaseId, logger)
  if (isError(courtCase)) {
    throw courtCase
  }

  const triggersToResolve = courtCase.triggers.filter(
    (trigger) => triggerIds.includes(trigger.triggerId) && !trigger.resolvedAt
  )

  if (triggersToResolve.length === 0) {
    throw new NotFoundError()
  }

  if (courtCase.triggerLockedByUsername !== user.username) {
    throw new Error(`Triggers are not locked by the user - ${courtCaseId}`)
  }

  const updateTriggersResult = await resolveTriggers(tx, user, triggersToResolve, auditLogEvents)
  if (isError(updateTriggersResult)) {
    throw updateTriggersResult
  }

  if (updateTriggersResult !== triggersToResolve.length) {
    throw new UnprocessableEntityError(`Failed to resolve triggers - ${courtCaseId}`)
  }

  const addNoteResult = await insertNotes(
    tx,
    getSystemNotesForTriggerCodes(
      triggersToResolve.map((a) => a.triggerCode),
      user.username
    ),
    "System",
    courtCaseId
  )

  if (isError(addNoteResult)) {
    throw addNoteResult
  }

  return courtCase
}

const handleUnlockingAndCompleting = async (
  tx: TransactionConnection,
  user: User,
  courtCaseId: number,
  courtCase: CaseDto,
  auditLogEvents: ApiAuditLogEvent[]
) => {
  const allTriggers = await getAllTriggers(tx, courtCaseId)
  if (isError(allTriggers)) {
    throw allTriggers
  }

  const triggersVisibleToUser = user.excludedTriggers
    ? allTriggers.filter((trigger) => !user.excludedTriggers.includes(trigger.trigger_code))
    : allTriggers

  const areAllTriggersResolved = allTriggers.filter((trigger) => trigger.resolved_ts).length === allTriggers.length

  const allTriggersVisibleToUserResolved =
    triggersVisibleToUser.filter((trigger) => trigger.resolved_ts).length === triggersVisibleToUser.length

  if (areAllTriggersResolved) {
    const hasUnresolvedExceptions =
      !!courtCase.errorCount && courtCase.errorCount > 0 && courtCase.errorResolvedTimestamp === null
    const updateCaseResult = await markTriggersAsCompleteAndAuditLog(
      tx,
      courtCaseId,
      hasUnresolvedExceptions,
      user,
      allTriggers,
      auditLogEvents
    )
    if (isError(updateCaseResult)) {
      throw updateCaseResult
    }
  }

  if (allTriggersVisibleToUserResolved) {
    const unlockResult = await unlockAndAppendAuditEvents(
      tx,
      user,
      courtCaseId,
      UnlockReason.Trigger,
      auditLogEvents,
      null,
      courtCase.triggerLockedByUsername
    )

    if (isError(unlockResult)) {
      throw unlockResult
    }
  }
}

const handleAuditLogging = async (
  tx: TransactionConnection,
  user: User,
  courtCaseId: number,
  auditLogEvents: ApiAuditLogEvent[],
  auditLogGateway: AuditLogDynamoGateway,
  logger: FastifyBaseLogger
) => {
  if (auditLogEvents.length > 0) {
    const caseMessageId = await selectMessageId(tx, user, courtCaseId)
    if (isError(caseMessageId)) {
      throw caseMessageId
    }

    const auditLogEventsResult = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
    if (isError(auditLogEventsResult)) {
      throw auditLogEventsResult
    }
  }
}

const resolveCaseTriggers = async (
  database: WritableDatabaseConnection,
  logger: FastifyBaseLogger,
  triggerIds: number[],
  courtCaseId: number,
  user: User,
  auditLogGateway: AuditLogDynamoGateway
): PromiseResult<void> => {
  const auditLogEvents: ApiAuditLogEvent[] = []

  if (!userAccess(user)[Permission.Triggers]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<Error | void>(async (tx) => {
      const courtCase = await handleResolvingTriggers(tx, user, courtCaseId, triggerIds, logger, auditLogEvents)

      await handleUnlockingAndCompleting(tx, user, courtCaseId, courtCase, auditLogEvents)

      await handleAuditLogging(tx, user, courtCaseId, auditLogEvents, auditLogGateway, logger)
    })
    .catch((error: Error) => error)
}

export default resolveCaseTriggers
