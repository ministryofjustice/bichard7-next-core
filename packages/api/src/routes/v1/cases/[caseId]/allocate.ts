import type { AllocationQuery } from "@moj-bichard7/common/contracts/AllocationQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { AllocationQuerySchema } from "@moj-bichard7/common/contracts/AllocationQuery"
import { isError } from "@moj-bichard7/common/types/Result"
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import auth from "../../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import allocate from "../../../../useCases/cases/getCase/allocate"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  body: AllocationQuery
  caseId: number
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  body: AllocationQuerySchema,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, body, caseId, database, logger, reply, user }: HandlerProps) => {
  if (Number.isNaN(caseId)) {
    return reply.code(BAD_REQUEST).send()
  }

  const result = await allocate(auditLogGateway, database.writable, user, logger, body, caseId)

  if (isError(result)) {
    reply.log.error(result)

    if (result instanceof NotAllowedError) {
      return reply.code(FORBIDDEN).send()
    }

    if (result instanceof NotFoundError) {
      return reply.code(NOT_FOUND).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send(result)
  }

  return reply.code(OK).send(result)
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).put(V1.CasesAllocate, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      body: req.body as AllocationQuery,
      caseId: Number(req.params.caseId),
      database: req.database,
      logger: req.log,
      reply,
      user: req.user
    })
  })
}

export default route
