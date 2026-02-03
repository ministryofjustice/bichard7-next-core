import type { ExceptionReportQuery } from "@moj-bichard7/common/types/Reports"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { CaseForReportSchema } from "@moj-bichard7/common/types/Case"
import Permission from "@moj-bichard7/common/types/Permission"
import { ExceptionReportQuerySchema } from "@moj-bichard7/common/types/Reports"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { isAfter } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import { Readable } from "node:stream"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { jsonResponse } from "../../../../server/openapi/jsonResponse"
import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { exceptionsReport } from "../../../../services/db/cases/reports/exceptions"
import { reportStream } from "../../../../useCases/cases/reports/reportStream"

type HandlerProps = {
  database: DatabaseGateway
  query: ExceptionReportQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  querystring: ExceptionReportQuerySchema,
  response: {
    [OK]: jsonResponse("Exceptions Report", CaseForReportSchema.array()),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, query, reply, user }: HandlerProps) => {
  if (!userAccess(user)[Permission.ViewReports]) {
    return reply.code(FORBIDDEN).send()
  }

  if (!query.triggers && !query.exceptions) {
    return reply.code(BAD_REQUEST).send()
  }

  if (isAfter(query.fromDate, query.toDate)) {
    return reply.code(BAD_REQUEST).send()
  }

  const stream = new Readable({ read() {} })

  reply.code(OK).type("application/json").send(stream)

  reportStream(stream, async (processBatch) => {
    return exceptionsReport(database.readonly, query, processBatch)
  }).catch((err: Error) => {
    stream.destroy(err)
  })

  return reply
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.CasesReportsExceptions, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
