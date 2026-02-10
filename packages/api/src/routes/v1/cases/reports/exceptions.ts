import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import {
  type ExceptionReportQuery,
  ExceptionReportQuerySchema,
  ExceptionReportSchema
} from "@moj-bichard7/common/types/Reports"
import { isError } from "@moj-bichard7/common/types/Result"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

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
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { NotValidQueryError } from "../../../../types/errors/NotValidQueryError"
import { generateExceptions } from "../../../../useCases/cases/reports/exceptions/generateExceptions"

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
    [OK]: jsonResponse("Exceptions Report", ExceptionReportSchema.array()),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, query, reply, user }: HandlerProps) => {
  const result = generateExceptions(database, user, query, reply)

  if (!isError(result)) {
    return reply
  }

  switch (true) {
    case result instanceof NotValidQueryError:
      return reply.code(BAD_REQUEST).send()
    case result instanceof NotAllowedError:
      return reply.code(FORBIDDEN).send()
    default:
      return reply.code(FORBIDDEN).send()
  }
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
