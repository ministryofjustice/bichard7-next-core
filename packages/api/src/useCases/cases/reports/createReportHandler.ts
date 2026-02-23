import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../types/DatabaseGateway"
import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotAllowedError } from "../../../types/errors/NotAllowedError"

type ReportStrategy<TQuery, TDto> = (database: DatabaseConnection, user: User, query: TQuery) => AsyncGenerator<TDto[]>

export const createReportHandler = <TQuery, TDto>(reportStrategy: ReportStrategy<TQuery, TDto>) => {
  return async (database: DatabaseGateway, user: User, query: TQuery, reply: FastifyReply): PromiseResult<void> => {
    if (!userAccess(user)[Permission.ViewReports]) {
      return new NotAllowedError()
    }

    const jsonStreamGenerator = async function* () {
      yield "["
      let isFirst = true

      const dataStream = reportStrategy(database.readonly, user, query)

      for await (const rows of dataStream) {
        for (const row of rows) {
          const chunk = isFirst ? JSON.stringify(row) : `,${JSON.stringify(row)}`
          yield chunk
          isFirst = false
        }
      }

      yield "]"
    }

    const stream = Readable.from(jsonStreamGenerator())

    return reply.code(OK).type("application/json").send(stream)
  }
}
