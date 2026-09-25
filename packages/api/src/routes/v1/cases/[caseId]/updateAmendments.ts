import type { Amendments } from "@moj-bichard7/common/types/Amendments"
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
import { amendCourtCase } from "../../../../useCases/cases/amendments/amendCourtCase"

type HandlerProps = {
  amendments: Partial<Amendments>
  auditLogGateway: AuditLogDynamoGateway
  caseId: number
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  body: z.object({
    amendments: z.any(), // TBD
    caseId: z.number().meta({ description: "Case ID" })
  }),
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: z.null().meta({ description: "Amendments updated successfully" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ amendments, auditLogGateway, caseId, database, logger, reply, user }: HandlerProps) => {
  const amendCourtCaseResult = await amendCourtCase(
    amendments,
    auditLogGateway,
    caseId,
    database.writable,
    logger,
    user
  )

  if (isError(amendCourtCaseResult)) {
    reply.log.error(amendCourtCaseResult)

    if (amendCourtCaseResult instanceof NotFoundError) {
      return reply.code(NOT_FOUND).send()
    }

    if (amendCourtCaseResult instanceof UnprocessableEntityError) {
      return reply.code(UNPROCESSABLE_ENTITY).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(OK).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CaseAmendments, { schema }, async (req, reply) => {
    await handler({
      amendments: req.body.amendments,
      auditLogGateway: req.auditLogGateway,
      caseId: Number(req.params.caseId),
      database: req.database,
      logger: req.log,
      reply,
      user: req.user
    })
  })
}

export default route
