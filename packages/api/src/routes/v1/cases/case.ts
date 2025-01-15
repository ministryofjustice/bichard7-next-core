import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { FullCaseDtoSchema } from "@moj-bichard7/common/types/Case"
import { FORBIDDEN, OK } from "http-status"
import z from "zod"

import type DataStoreGateway from "../../../services/gateways/interfaces/dataStoreGateway"

import { V1 } from "../../../endpoints/versionedEndpoints"
import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import fetchCaseDTO from "../../../useCases/dto/fetchCaseDTO"

type HandlerProps = {
  caseId: number
  db: DataStoreGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  params: z.object({
    caseId: z.string().openapi({
      description: "Case ID"
    })
  }),
  response: {
    [OK]: FullCaseDtoSchema.openapi({ description: "Case DTO" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, db, logger, reply, user }: HandlerProps) =>
  fetchCaseDTO(user, db, caseId, logger)
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
      caseId: Number(req.params.caseId),
      db: req.db,
      logger: req.log,
      reply,
      user: req.user
    })
  })
}

export default route
