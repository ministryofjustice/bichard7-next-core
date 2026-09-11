import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import insertNote from "../../../services/db/cases/insertNote"
import selectMessageId from "../../../services/db/cases/selectMessageId"
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
  return await databaseConnection
    .transaction<Error | void>(async (tx) => {
      const auditLogEvents: ApiAuditLogEvent[] = []

      const resolveErrorResult = await resolveError(tx, user, caseId, resolution, auditLogEvents, logger)
      if (isError(resolveErrorResult)) {
        throw resolveErrorResult
      }

      const unlockResult = await unlockAndAuditLog(tx, user, caseId, UnlockReason.TriggerAndException, auditLogEvents)
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
