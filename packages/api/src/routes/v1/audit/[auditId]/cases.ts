import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { type AuditCasesQuery, AuditCasesQuerySchema } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import { AuditCasesMetadataSchema } from "@moj-bichard7/common/types/AuditCase"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { jsonResponse } from "../../../../server/openapi/jsonResponse"
import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { getAuditCases } from "../../../../useCases/audit/getAuditCases"

type HandlerProps = {
  database: DatabaseGateway
  query: AuditCasesQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  params: z.object({ auditId: z.coerce.number().meta({ description: "Audit ID" }) }),
  querystring: AuditCasesQuerySchema,
  response: {
    [OK]: jsonResponse("Audit Cases", AuditCasesMetadataSchema),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Audit V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, query, reply, user }: HandlerProps) => {
  const result = await getAuditCases(database.writable, query, user)
  if (isError(result)) {
    reply.log.error(result)

    if (result instanceof NotAllowedError) {
      return reply.code(FORBIDDEN).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(OK).send({
    cases: [],
    maxPerPage: 50,
    pageNum: 1,
    returnCases: 0,
    totalCases: 0
  })
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.AuditCases, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
