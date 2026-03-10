import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { exceptionsReport } from "../../../../services/db/cases/reports/exceptions"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"

export const generateExceptions = async (
  database: DatabaseGateway,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  query: ExceptionReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  const start = Date.now()

  try {
    return await createReportHandler(
      exceptionsReport,
      async (totalRecords: number): PromiseResult<void> => {
        const duration = Date.now() - start

        return await createReportAuditLog({
          auditLogGateway,
          duration,
          fromDate: query.fromDate,
          reportType: "exceptions",
          toDate: query.toDate,
          totalRecords,
          user
        })
      },
      (chunk) => chunk.reduce((acc, userRow) => acc + userRow.cases.length, 0)
    )(database, user, query, reply)
  } catch (err) {
    console.error("Stream failed, audit log not recorded", err)
    return err as Error
  }
}
