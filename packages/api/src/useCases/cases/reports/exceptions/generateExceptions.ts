import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { exceptionsReport } from "../../../../services/db/cases/reports/exceptions"
import { createReportHandler } from "../createReportHandler"

export const generateExceptions = async (
  database: DatabaseGateway,
  user: User,
  query: ExceptionReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  return await createReportHandler(exceptionsReport)(database, user, query, reply)
}
