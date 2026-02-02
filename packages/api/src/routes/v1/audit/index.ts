import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { AuditSchema } from "@moj-bichard7/common/types/Audit"
import { type CreateAudit, CreateAuditSchema } from "@moj-bichard7/common/types/CreateAudit"
import { CREATED } from "http-status"

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
    [CREATED]: jsonResponse("Created Audit", AuditSchema),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Audit V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ reply }: HandlerProps) => {
  return reply.code(CREATED)
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
