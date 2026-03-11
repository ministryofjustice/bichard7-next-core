import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { warrants } from "../../../../services/db/cases/reports/warrants"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"

export const generateWarrantsReport = async (
  database: DatabaseGateway,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  query: WarrantsReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  const start = Date.now()

  try {
    return await createReportHandler(warrants, async (totalRecords: number): PromiseResult<void> => {
      const duration = Date.now() - start

      return await createReportAuditLog({
        auditLogGateway,
        duration,
        fromDate: query.fromDate,
        reportType: "warrants",
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
