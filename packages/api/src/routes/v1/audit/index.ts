import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { type CreateAudit, CreateAuditSchema } from "@moj-bichard7/common/contracts/CreateAudit"
import { AuditDtoSchema } from "@moj-bichard7/common/types/Audit"
import { isError } from "@moj-bichard7/common/types/Result"
import { CREATED, INTERNAL_SERVER_ERROR } from "http-status"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { jsonResponse } from "../../../server/openapi/jsonResponse"
import auth from "../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { createAudit } from "../../../useCases/audit/createAudit"

type HandlerProps = {
  body: CreateAudit
  database: DatabaseGateway
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  body: CreateAuditSchema,
  response: {
    [CREATED]: jsonResponse("Created Audit", AuditDtoSchema),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Audit V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ body, database, reply, user }: HandlerProps) => {
  const auditResult = await createAudit(database.writable, body, user)
  if (isError(auditResult)) {
    reply.log.error(auditResult)
    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(CREATED).send(auditResult)
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.Audit, { schema }, async (req, reply) => {
    await handler({
      body: req.body,
      database: req.database,
      reply,
      user: req.user
    })
  })
}

export default route
