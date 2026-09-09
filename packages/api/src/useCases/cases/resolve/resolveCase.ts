import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import insertNote from "../../../services/db/cases/insertNote"
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
      const resolveErrorResult = await resolveError(tx, user, caseId, resolution)
      if (isError(resolveErrorResult)) {
        return resolveErrorResult
      }

      const unlockResult = await unlockAndAuditLog(
        tx,
        user,
        caseId,
        UnlockReason.TriggerAndException,
        auditLogGateway,
        logger
      )
      if (isError(unlockResult)) {
        return unlockResult
      }

      const noteText =
        `${user.username}: Portal Action: Record Manually Resolved.` +
        ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`

      const insertNoteResult = await insertNote(tx, caseId, noteText, "System").catch((err: Error) => err)

      if (isError(insertNoteResult)) {
        return insertNoteResult
      }

      // audit logging (TBD)
    })
    .catch((err: Error) => err)
}
