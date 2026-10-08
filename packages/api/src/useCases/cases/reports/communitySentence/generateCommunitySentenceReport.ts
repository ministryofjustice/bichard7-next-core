import type { CommunitySentenceReportQuery } from "@moj-bichard7/common/contracts/CommunitySentenceReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { communitySentenceReport } from "../../../../services/db/cases/reports/communitySentence"
import { createReportHandler } from "../createReportHandler"

export const generateCommunitySentenceReport = async (
  database: DatabaseGateway,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  query: CommunitySentenceReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  const start = Date.now()

  try {
    return await createReportHandler(communitySentenceReport, async (totalRecords: number): PromiseResult<void> => {
      const duration = Date.now() - start

      /*    return await createReportAuditLog({
        auditLogGateway,
        duration,
        fromDate: query.fromDate,
        reportType: "community sentence",
        toDate: query.toDate,
        totalRecords,
        user
      }) */
    })(database, user, query, reply)
  } catch (err) {
    console.error("Stream failed, audit log not recorded", err)
    return err as Error
  }
}
