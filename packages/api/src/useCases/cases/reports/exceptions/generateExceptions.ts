import type { ExceptionReportQuery } from "@moj-bichard7/common/types/ExceptionReport"
import type { Result } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { exceptionsReport } from "../../../../services/db/cases/reports/exceptions"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { reportStream } from "../reportStream"

export const generateExceptions = (
  database: DatabaseGateway,
  user: User,
  query: ExceptionReportQuery,
  reply: FastifyReply
): Result<void> => {
  if (!userAccess(user)[Permission.ViewReports]) {
    return new NotAllowedError()
  }

  const stream = new Readable({ read() {} })

  reply.code(OK).type("application/json").send(stream)

  reportStream(stream, async (processBatch) => {
    return exceptionsReport(database.readonly, user, query, processBatch)
  }).catch((err: Error) => {
    stream.destroy(err)
  })
}
