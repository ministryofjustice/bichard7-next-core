import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { CaseDtoSchema } from "@moj-bichard7/common/types/Case"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
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
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../../types/errors/UnprocessableEntityError"
import lockAndFetchCaseDto from "../../../../useCases/cases/getCase/lockAndFetchCaseDto"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  caseId: number
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

// unvalidatedHearingOutcomeSchema breaks Swagger/zod
const SimplifiedCaseDtoSchema = CaseDtoSchema.extend({
  aho: z.object({}).meta({ description: "Annotated Hearing Outcome" }),
  updatedHearingOutcome: z.object({}).meta({ description: "Updated Annotated Hearing Outcome" })
}).meta({ description: "Case DTO" })

const schema = {
  ...auth,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: jsonResponse("Case DTO", SimplifiedCaseDtoSchema),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, caseId, database, logger, reply, user }: HandlerProps) => {
  const caseResult = await lockAndFetchCaseDto(database.writable, auditLogGateway, user, caseId, logger)

  if (!isError(caseResult)) {
    return reply.code(OK).send(caseResult)
  }

  reply.log.error(caseResult)

  switch (true) {
    case caseResult instanceof NotFoundError:
      return reply.code(NOT_FOUND).send()
    case caseResult instanceof UnprocessableEntityError:
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: caseResult.message, statusCode: UNPROCESSABLE_ENTITY })
    default:
      return reply.code(FORBIDDEN).send()
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Case, { schema }, async (req, reply) => {
    await handler({
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
