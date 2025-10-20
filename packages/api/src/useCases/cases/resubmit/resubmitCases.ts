import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { fetchCasesForAutoResubmit } from "../../../services/db/cases/fetchCasesForAutoResubmit"
import createAuditLogEvents from "../../createAuditLogEvents"
import { lockExceptions } from "../getCase/lockExceptions"
import { hasPncConnectionException } from "./hasPncConnectionException"
import { resubmitCase } from "./resubmitCase"

type BulkResubmit = Record<string, Error | ResubmitDetails>

type ResubmitDetails = {
  errorId: number
  events: ApiAuditLogEvent[]
}

const lockCasesAndAuditLog = async (
  databaseConnection: WritableDatabaseConnection,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  cases: CaseRow[],
  bulkResubmit: BulkResubmit
): Promise<void> => {
  for (const caseRow of cases.filter(hasPncConnectionException)) {
    const resubmitDetails: ResubmitDetails = {
      errorId: caseRow.error_id,
      events: []
    }

    const lockExceptionsResult = await lockExceptions(
      databaseConnection,
      user,
      caseRow.error_id,
      resubmitDetails.events,
      "Bichard API Auto Resubmit"
    )

    if (isError(lockExceptionsResult)) {
      throw lockExceptionsResult
    }

    bulkResubmit[caseRow.message_id] = resubmitDetails
  }

  for (const [messageId, resubmitDetails] of Object.entries(bulkResubmit)) {
    if (!(resubmitDetails instanceof Error)) {
      const auditLogEventsResult = await createAuditLogEvents(resubmitDetails.events, messageId, auditLogGateway)

      if (isError(auditLogEventsResult)) {
        throw auditLogEventsResult
      }
    }
  }
}

export const resubmitCases = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  auditLogGateway: AuditLogDynamoGateway
): PromiseResult<BulkResubmit> => {
  if (!user.groups.includes(UserGroup.Service)) {
    return new Error("Missing System User")
  }

  const bulkResubmit: BulkResubmit = {}

  const lockAndAuditLogResult = await databaseConnection
    .transaction(async (trx: WritableDatabaseConnection): PromiseResult<BulkResubmit> => {
      const cases = await fetchCasesForAutoResubmit(trx, user)

      if (isError(cases)) {
        throw cases
      }

      await lockCasesAndAuditLog(databaseConnection, auditLogGateway, user, cases, bulkResubmit)

      return bulkResubmit
    })
    .catch((error: Error) => error)

  if (isError(lockAndAuditLogResult)) {
    return lockAndAuditLogResult
  }

  for (const [messageId, resubmitDetails] of Object.entries(lockAndAuditLogResult)) {
    if (!(resubmitDetails instanceof Error)) {
      const resubmitResult = await resubmitCase(databaseConnection, user, resubmitDetails.errorId)

      if (isError(resubmitResult)) {
        bulkResubmit[messageId] = resubmitResult
      }
    }
  }

  return bulkResubmit
}
