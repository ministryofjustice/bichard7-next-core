import type { BailsReportQuery } from "@moj-bichard7/common/contracts/BailsReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { bailsReport } from "../../../../services/db/cases/reports/bails"
import { createReportHandler } from "../createReportHandler"

export const generateBailsReport = async (
  database: DatabaseGateway,
  user: User,
  query: BailsReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  return await createReportHandler(bailsReport)(database, user, query, reply)
}
