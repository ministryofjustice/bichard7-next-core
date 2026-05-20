import type { UserSummaryReportQuery } from "@moj-bichard7/common/contracts/UserSummaryReportQuery"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { userPerformanceSummary } from "../../../../services/db/cases/reports/userPerformanceSummary"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"

export const generateUserPerformanceSummaryReport = async (
  database: DatabaseGateway,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  query: UserSummaryReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  const start = Date.now()

  try {
    return await createReportHandler(
      userPerformanceSummary,
      async (totalRecords: number): PromiseResult<void> => {
        const duration = Date.now() - start

        return await createReportAuditLog({
          auditLogGateway,
          duration,
          fromDate: query.fromDate,
          reportType: "user summary",
          toDate: query.toDate,
          totalRecords,
          user
        })
      },
      (chunk) => chunk.reduce((acc, dailyRow) => acc + dailyRow.users.length, 0)
    )(database, user, query, reply)
  } catch (err) {
    console.error("Stream failed, audit log not recorded", err)
    return err as Error
  }
}
