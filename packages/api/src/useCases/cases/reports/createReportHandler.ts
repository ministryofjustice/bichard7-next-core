import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../types/DatabaseGateway"
import type { TransactionConnection } from "../../../types/DatabaseGateway"

import { NotAllowedError } from "../../../types/errors/NotAllowedError"

type ReportStrategy<TQuery, TDto> = (
  database: TransactionConnection,
  user: User,
  query: TQuery
) => AsyncGenerator<TDto[]>

export const createReportHandler = <TQuery, TDto>(
  reportStrategy: ReportStrategy<TQuery, TDto>,
  onStreamComplete?: (totalCount: number) => Promise<PromiseResult<void> | void> | PromiseResult<void> | void,
  extractCount: (chunk: TDto[]) => number = (chunk) => chunk.length
) => {
  return async (database: DatabaseGateway, user: User, query: TQuery, reply: FastifyReply): PromiseResult<void> => {
    if (!userAccess(user)[Permission.ViewReports]) {
      return new NotAllowedError()
    }

    return database.writable.transaction(async (transactionalDb) => {
      async function* jsonStreamGenerator() {
        yield "["
        let isFirst = true
        let totalCount = 0

        const dataStream = reportStrategy(transactionalDb, user, query)

        for await (const chunk of dataStream) {
          totalCount += extractCount(chunk)

          for (const row of chunk) {
            yield isFirst ? JSON.stringify(row) : `,${JSON.stringify(row)}`
            isFirst = false
          }
        }

        yield "]"

        if (onStreamComplete) {
          const callbackResult = await onStreamComplete(totalCount)
          if (isError(callbackResult)) {
            console.error("Stream completed, but callback returned an error:", callbackResult)
          }
        }
      }

      const stream = Readable.from(jsonStreamGenerator())
      reply.code(OK).type("application/json").send(stream)

      await new Promise<void>((resolve, reject) => {
        reply.raw.on("finish", resolve)
        reply.raw.on("error", reject)
      })
    })
  }
}
