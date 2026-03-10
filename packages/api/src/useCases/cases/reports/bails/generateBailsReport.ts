import type { BailsReportQuery } from "@moj-bichard7/common/contracts/BailsReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { bailsReport } from "../../../../services/db/cases/reports/bails"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"

export const generateBailsReport = async (
  database: DatabaseGateway,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  query: BailsReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  const start = Date.now()

  try {
    return await createReportHandler(bailsReport, async (totalRecords: number): PromiseResult<void> => {
      const duration = Date.now() - start

      return await createReportAuditLog({
        auditLogGateway,
        duration,
        fromDate: query.fromDate,
        reportType: "bails",
        toDate: query.toDate,
        totalRecords,
        user
      })
    })(database, user, query, reply)
  } catch (err) {
    console.error("Stream failed, audit log not recorded", err)
    return err as Error
  }
}
