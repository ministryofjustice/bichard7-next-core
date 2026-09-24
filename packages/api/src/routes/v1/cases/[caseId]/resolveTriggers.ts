import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../../types/errors/UnprocessableEntityError"
import resolveCaseTriggers from "../../../../useCases/cases/resolve/resolveCaseTriggers"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  caseId: number
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  triggerIds: number[]
  user: User
}

const schema = {
  ...auth,
  body: z.object({
    triggerIds: z.array(z.number()).min(1).meta({ description: "Array of Trigger IDs to resolve" })
  }),
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: z.null().meta({ description: "Triggers successfully resolved" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, caseId, database, logger, reply, triggerIds, user }: HandlerProps) => {
  const resolveTriggersResult = await resolveCaseTriggers(
    database.writable,
    logger,
    triggerIds,
    caseId,
    user,
    auditLogGateway
  )

  if (isError(resolveTriggersResult)) {
    reply.log.error(resolveTriggersResult)

    if (resolveTriggersResult instanceof NotFoundError) {
      return reply.code(NOT_FOUND).send()
    }

    if (resolveTriggersResult instanceof UnprocessableEntityError) {
      return reply.code(UNPROCESSABLE_ENTITY).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(OK).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CasesResolveTriggers, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      caseId: Number(req.params.caseId),
      database: req.database,
      logger: req.log,
      reply,
      triggerIds: req.body.triggerIds,
      user: req.user
    })
  })
}

export default route
