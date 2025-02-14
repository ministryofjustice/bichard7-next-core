import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { CaseDtoSchema } from "@moj-bichard7/common/types/Case"
import { FORBIDDEN, OK } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type DataStoreGateway from "../../../services/gateways/interfaces/dataStoreGateway"

import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import fetchCaseDto from "../../../useCases/cases/lockAndFetchCaseDto"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  caseId: number
  dataStore: DataStoreGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  params: z.object({ caseId: z.string().openapi({ description: "Case ID" }) }),
  response: {
    [OK]: CaseDtoSchema.openapi({ description: "Case DTO" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, caseId, dataStore, logger, reply, user }: HandlerProps) =>
  fetchCaseDto(user, dataStore, caseId, auditLogGateway, logger)
    .then((foundCase) => {
      reply.code(OK).send(foundCase)
    })
    .catch((err) => {
      reply.log.error(err)
      reply.code(FORBIDDEN).send()
    })

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Case, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      caseId: Number(req.params.caseId),
      dataStore: req.dataStore,
      logger: req.log,
      reply,
      user: req.user
    })
  })
}

export default route
