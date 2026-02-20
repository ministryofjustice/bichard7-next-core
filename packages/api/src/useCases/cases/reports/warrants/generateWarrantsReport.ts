import type { WarrantsReportQuery } from "@moj-bichard7/common/types/reports/WarrantsReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { warrants } from "../../../../services/db/cases/reports/warrants"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { reportStream } from "../reportStream"

export const generateWarrantsReport = async (
  database: DatabaseGateway,
  user: User,
  query: WarrantsReportQuery,
  reply: FastifyReply
): PromiseResult<void> => {
  if (!userAccess(user)[Permission.ViewReports]) {
    return new NotAllowedError()
  }

  const stream = new Readable({ read() {} })

  reply.code(OK).type("application/json").send(stream)

  try {
    await reportStream(stream, (processBatch) => {
      return warrants(database.readonly, user, query, processBatch)
    })

    stream.push(null)
  } catch (err) {
    return err as Error
  }
}
