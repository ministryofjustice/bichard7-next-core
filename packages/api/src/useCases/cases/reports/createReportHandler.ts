import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { type DatabaseConnection } from "../../../types/DatabaseGateway"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import { reportStream } from "./reportStream"

type ReportStrategy<TQuery, TDto> = (
  database: DatabaseConnection,
  user: User,
  query: TQuery,
  processChunk: (rows: TDto[]) => Promise<void>
) => Promise<void>

export const createReportHandler = <TQuery, TDto>(reportStrategy: ReportStrategy<TQuery, TDto>) => {
  return async (database: DatabaseGateway, user: User, query: TQuery, reply: FastifyReply): PromiseResult<void> => {
    if (!userAccess(user)[Permission.ViewReports]) {
      return new NotAllowedError()
    }

    const stream = new Readable({ read() {} })

    reply.code(OK).type("application/json").send(stream)

    return await reportStream(stream, (processBatch) => {
      return reportStrategy(database.readonly, user, query, processBatch)
    }).catch((error) => error)
  }
}
