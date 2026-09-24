import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"
import getSystemNotesForTriggerCodes from "../../services/db/cases/getSystemNotesForTriggerCodes"
import insertNotes from "../../services/db/cases/insertNotes"
import selectMessageId from "../../services/db/cases/selectMessageId"
import { NotFoundError } from "../../types/errors/NotFoundError"
import createAuditLogEvents from "../createAuditLogEvents"
import { getAllTriggers } from "./getCase/getAllTriggers"
import { markTriggersAsCompleteAndAuditLog } from "./getCase/markTriggersAsCompleteAndAuditLog"
import { unlockAndAppendAuditEvents } from "./getCase/unlockAndAppendAuditEvents"
import { updateTriggers } from "./getCase/updateTriggers"

const resolveTriggers = async (
  database: WritableDatabaseConnection,
  logger: FastifyBaseLogger,
  triggerIds: number[],
  courtCaseId: number,
  user: User,
  auditLogGateway: AuditLogDynamoGateway
): PromiseResult<void> => {
  const resolver = user.username
  const auditLogEvents: ApiAuditLogEvent[] = []

  return await database
    .transaction<Error | void>(async (tx) => {
      const courtCase = await fetchCase(tx, user, courtCaseId, logger)
      if (isError(courtCase)) {
        throw courtCase
      }

      if (!courtCase) {
        throw Error("Court case not found")
      }

      const triggersToResolve = courtCase.triggers.filter(
        (trigger) => triggerIds.includes(trigger.triggerId) && !trigger.resolvedAt
      )

      if (triggersToResolve.length === 0) {
        return new NotFoundError()
      }

      const unresolvedTriggerIds = triggersToResolve.map((trigger) => trigger.triggerId)

      if (courtCase.triggerLockedByUsername !== user.username) {
        throw Error(`Triggers are not locked by the user - ${courtCaseId}`)
      }

      const updateTriggersResult = await updateTriggers(tx, user, unresolvedTriggerIds, auditLogEvents)
      if (isError(updateTriggersResult)) {
        throw updateTriggersResult
      }

      if (updateTriggersResult !== unresolvedTriggerIds.length) {
        throw Error(`Failed to resolve triggers - ${courtCaseId}`)
      }

      const addNoteResult = await insertNotes(
        tx,
        getSystemNotesForTriggerCodes(
          triggersToResolve.map((a) => a.triggerCode),
          resolver
        ),
        "System",
        courtCaseId
      )

      if (isError(addNoteResult)) {
        throw addNoteResult
      }

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
    })
    .catch((error: Error) => error)
}

export default resolveTriggers
