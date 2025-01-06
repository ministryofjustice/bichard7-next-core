import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { FullCaseDTOSchema } from "@moj-bichard7/common/types/Case"
import { FORBIDDEN, OK } from "http-status"
import z from "zod"

import type DataStoreGateway from "../../../services/gateways/interfaces/dataStoreGateway"

import { VersionedEndpoints } from "../../../endpoints/versionedEndpoints"
import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import fetchFullCaseDTO from "../../../useCases/dto/fetchFullCaseDTO"

type HandlerProps = {
  caseId: number
  db: DataStoreGateway
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
    [OK]: FullCaseDTOSchema.openapi({ description: "Case DTO" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, db, reply, user }: HandlerProps) =>
  fetchFullCaseDTO(user, db, caseId)
    .then((foundCase) => {
      reply.code(OK).send(foundCase)
    })
    .catch((err) => {
      reply.log.error(err)
      reply.code(FORBIDDEN).send()
    })

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(VersionedEndpoints.V1.Case, { schema }, async (req, reply) => {
    await handler({
      caseId: Number(req.params.caseId),
      db: req.db,
      reply,
      user: req.user
    })
  })
}

export default route
