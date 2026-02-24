import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { warrants } from "../../../../services/db/cases/reports/warrants"
import { createReportHandler } from "../createReportHandler"

export const generateWarrantsReport = async (
  database: DatabaseGateway,
  user: User,
  query: WarrantsReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  return await createReportHandler(warrants)(database, user, query, reply)
}
