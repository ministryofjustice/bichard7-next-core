import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { ACCEPTED, BAD_GATEWAY, FORBIDDEN, UNPROCESSABLE_ENTITY } from "http-status"
import { randomUUID } from "node:crypto"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../types/DatabaseGateway"

import { jsonResponse } from "../../../server/openapi/jsonResponse"
import auth from "../../../server/schemas/auth"
import { forbiddenError, unauthorizedError, unprocessableEntityError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import handleDisconnectedError from "../../../services/db/handleDisconnectedError"
import { resubmitCases } from "../../../useCases/cases/resubmit/resubmitCases"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  database: DatabaseGateway
  reply: FastifyReply
  user: User
}

const resubmitCasesSchema = z.record(
  z.string().meta({ examples: ["messageId"] }),
  z
    .object({
      errorId: z.number().optional(), // Success field
      message: z.string().optional(),
      name: z.string().optional(),
      stack: z.string().optional(),
      workflowId: z.string().optional() // Success field
    })
    .meta({
      description: "Contains either errorId (success) OR message/name/stack (error)",
      examples: [
        { errorId: "12345", workflowId: randomUUID() },
        { message: "Something went wrong", name: "Error" }
      ]
    })
)

export type ResubmitCases = z.infer<typeof resubmitCasesSchema>

const schema = {
  ...auth,
  response: {
    [ACCEPTED]: jsonResponse("Resubmit Cases", resubmitCasesSchema),
    ...unauthorizedError(),
    ...unprocessableEntityError(),
    ...forbiddenError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, database, reply, user }: HandlerProps) => {
  const resubmittedCases = await resubmitCases(database.writable, user, auditLogGateway)

  if (!isError(resubmittedCases)) {
    return reply.code(ACCEPTED).send(resubmittedCases)
  }

  reply.log.error(resubmittedCases)

  switch (true) {
    case resubmittedCases.message === "Missing System User":
      return reply.code(FORBIDDEN).send()
    case handleDisconnectedError(resubmittedCases):
      return reply.code(BAD_GATEWAY).send()
    default:
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: resubmittedCases.message, statusCode: UNPROCESSABLE_ENTITY })
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CasesResubmit, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      database: req.database,
      reply,
      user: req.user
    })
  })
}

export default route
