import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchCase from "../../../services/db/cases/fetchCase"
import insertNote from "../../../services/db/cases/insertNote"
import selectMessageId from "../../../services/db/cases/selectMessageId"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import createAuditLogEvents from "../../createAuditLogEvents"
import { unlockAndAuditLog } from "../getCase/unlockAndAuditLog"
import { resolveError } from "./resolveError"

export const resolveCase = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number,
  resolution: ResolveBody,
  auditLogGateway: AuditLogDynamoGateway,
  logger: FastifyBaseLogger
): PromiseResult<void> => {
  if (!userAccess(user)[Permission.Exceptions]) {
    return new NotAllowedError()
  }

  return await databaseConnection
    .transaction<Error | void>(async (tx) => {
      const auditLogEvents: ApiAuditLogEvent[] = []

      // verify the case exists and perform permissions checks, this also checks the case is not locked to another user
      const caseResult = await fetchCase(tx, user, caseId, logger)

      if (isError(caseResult)) {
        return caseResult
      }

      const resolveErrorResult = await resolveError(tx, user, caseId, resolution, auditLogEvents)
      if (isError(resolveErrorResult)) {
        throw resolveErrorResult
      }

      const unlockReason = userAccess(user)[Permission.Triggers]
        ? UnlockReason.TriggerAndException
        : UnlockReason.Exception

      const unlockResult = await unlockAndAuditLog(
        tx,
        user,
        caseId,
        unlockReason,
        auditLogEvents,
        caseResult.errorLockedByUsername,
        caseResult.triggerLockedByUsername
      )
      if (isError(unlockResult)) {
        throw unlockResult
      }

      const noteText =
        `${user.username}: Portal Action: Record Manually Resolved.` +
        ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`

      const insertNoteResult = await insertNote(tx, caseId, noteText, "System").catch((err: Error) => err)
      if (isError(insertNoteResult)) {
        throw insertNoteResult
      }

      if (auditLogEvents.length > 0) {
        const caseMessageId = await selectMessageId(tx, user, caseId)
        if (isError(caseMessageId)) {
          throw caseMessageId
        }

        const auditLogEventsResult = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
        if (isError(auditLogEventsResult)) {
          throw auditLogEventsResult
        }
      }
    })
    .catch((err: Error) => err)
}
