import type { ReallocationBody } from "@moj-bichard7/common/contracts/ReallocationBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ReallocationBodySchema } from "@moj-bichard7/common/contracts/ReallocationBody"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../../types/DatabaseGateway"

import auth from "../../../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../../../server/schemas/errorReasons"
import useZod from "../../../../../server/useZod"
import { NotAllowedError } from "../../../../../types/errors/NotAllowedError"
import { NotFoundError } from "../../../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../../../types/errors/UnprocessableEntityError"
import reallocateCourtCaseToForce from "../../../../../useCases/cases/reallocate/reallocateCourtCaseToForce"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  body: ReallocationBody
  caseId: number
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  body: ReallocationBodySchema,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, body, caseId, database, logger, reply, user }: HandlerProps) => {
  const result = await reallocateCourtCaseToForce(auditLogGateway, database.writable, user, logger, body, caseId)

  if (isError(result)) {
    reply.log.error(result)

    if (result instanceof NotAllowedError) {
      return reply.code(FORBIDDEN).send()
    }

    if (result instanceof NotFoundError) {
      return reply.code(NOT_FOUND).send()
    }

    if (result instanceof UnprocessableEntityError) {
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: result.message, statusCode: UNPROCESSABLE_ENTITY })
    }

    return reply.code(INTERNAL_SERVER_ERROR).send(result)
  }

  return reply.code(OK).send({ success: true })
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CaseReallocate, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      body: req.body,
      caseId: Number(req.params.caseId),
      database: req.database,
      logger: req.log,
      reply,
      user: req.user
    })
  })
}

export default route
