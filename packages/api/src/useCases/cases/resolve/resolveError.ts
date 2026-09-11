import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionReasonCode } from "@moj-bichard7/common/types/ManualResolution"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { validateManualResolution } from "@moj-bichard7/common/utils/validateManualResolution"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { TransactionConnection } from "../../../types/DatabaseGateway"

import checkAllTriggersResolved from "../../../services/db/cases/checkAllTriggersResolved"
import fetchCase from "../../../services/db/cases/fetchCase"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import buildAuditLogEvent from "../../auditLog/buildAuditLogEvent"

export const resolveError = async (
  tx: TransactionConnection,
  user: User,
  caseId: number,
  resolution: ResolveBody,
  auditLogEvents: ApiAuditLogEvent[],
  logger: FastifyBaseLogger
): PromiseResult<void> => {
  const resolutionError = validateManualResolution(resolution).error

  if (resolutionError) {
    return new Error(resolutionError)
  }

  const caseResult = await fetchCase(tx, user, caseId, logger)

  if (isError(caseResult)) {
    return caseResult
  }

  if (caseResult.errorStatus === "Resolved") {
    return
  }

  const resolver = user.username
  const resolutionTimestamp = new Date()

  const updateFields: Record<string, unknown> = {
    error_resolved_by: resolver,
    error_resolved_ts: resolutionTimestamp,
    error_status: ResolutionStatusNumber.Resolved
  }

  const allTriggersResolved = await checkAllTriggersResolved(tx, caseId)

  if (allTriggersResolved) {
    updateFields.resolution_ts = resolutionTimestamp
  }

  const updateResult = await tx.connection`
    UPDATE br7own.error_list
    SET ${tx.connection(updateFields)}
    WHERE error_id = ${caseId} AND error_locked_by_id = ${resolver} AND error_count > 0 AND error_status = ${ResolutionStatusNumber.Unresolved}
  `.catch((error: Error) => error)

  if (isError(updateResult)) {
    return new Error(`Couldn't resolve case id:${caseId}: ${updateResult.message}`)
  }

  if (updateResult.count === 0) {
    return new UnprocessableEntityError(`Couldn't resolve case id: ${caseId}`)
  }

  auditLogEvents.push(
    buildAuditLogEvent(EventCode.ExceptionsResolved, EventCategory.information, "Bichard New UI", {
      auditLogVersion: 2,
      resolutionReasonCode: ResolutionReasonCode[resolution.reason],
      resolutionReasonText: resolution.reasonText ?? "",
      user: user.username
    })
  )
}
