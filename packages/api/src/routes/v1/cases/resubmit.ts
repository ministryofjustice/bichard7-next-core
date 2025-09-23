import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { ACCEPTED, BAD_GATEWAY, FORBIDDEN, NOT_FOUND, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { jsonResponse } from "../../../server/openapi/jsonResponse"
import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import handleDisconnectedError from "../../../services/db/handleDisconnectedError"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import { resubmitCase } from "../../../useCases/cases/resubmit/resubmitCase"

type HandlerProps = { caseId: number; database: DatabaseGateway; reply: FastifyReply; user: User }

const schema = {
  ...auth,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [ACCEPTED]: jsonResponse(
      "Successful Resubmit",
      z
        .object({ messageId: z.uuid().meta({ description: "Confirmation of the Message ID" }) })
        .meta({ description: "Successful Resubmit" })
    ),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, database, reply, user }: HandlerProps) => {
  const result = await resubmitCase(database.writable, user, caseId)

  if (!isError(result)) {
    return reply.code(ACCEPTED).send({ messageId: result.messageId })
  }

  reply.log.error(result)

  switch (true) {
    case result instanceof NotFoundError:
      return reply.code(NOT_FOUND).send()
    case result instanceof UnprocessableEntityError:
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: result.message, statusCode: UNPROCESSABLE_ENTITY })
    case handleDisconnectedError(result):
      return reply.code(BAD_GATEWAY).send()
    default:
      return reply.code(FORBIDDEN).send()
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CaseResubmit, { schema }, async (req, reply) => {
    await handler({
      caseId: Number(req.params.caseId),
      database: req.database,
      reply,
      user: req.user
    })
  })
}

export default route
