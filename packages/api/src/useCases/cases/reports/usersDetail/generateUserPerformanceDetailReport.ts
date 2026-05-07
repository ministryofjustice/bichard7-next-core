import type { UserPerformanceDetailReportQuery } from "@moj-bichard7/common/contracts/UserPerformanceDetailReportQuery"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { userPerformanceDetail } from "../../../../services/db/cases/reports/userPerformanceDetail"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"

export const generateUserPerformanceDetailReport = async (
  database: DatabaseGateway,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  query: UserPerformanceDetailReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  const start = Date.now()

  try {
    return await createReportHandler(
      userPerformanceDetail,
      async (totalRecords: number): PromiseResult<void> => {
        const duration = Date.now() - start

        return await createReportAuditLog({
          auditLogGateway,
          duration,
          fromDate: query.fromDate,
          reportType: "user detail",
          toDate: query.toDate,
          totalRecords,
          user
        })
      },
      (chunk) => {
        return chunk.reduce((acc, dailyRow) => {
          return acc + dailyRow.exceptions.length + dailyRow.triggers.length
        }, 0)
      }
    )(database, user, query, reply)
  } catch (err) {
    console.error("Stream failed, audit log not recorded", err)
    return err as Error
  }
}
