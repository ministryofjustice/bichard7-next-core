import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { domesticViolenceReport } from "../../../../services/db/cases/reports/domesticViolence"
import { createReportHandler } from "../createReportHandler"

export const generateDomesticViolenceReport = (
  database: DatabaseGateway,
  user: User,
  query: DomesticViolenceReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  return createReportHandler(domesticViolenceReport)(database, user, query, reply)
}
