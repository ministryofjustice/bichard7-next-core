import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { CaseSchema } from "@moj-bichard7/common/types/Case"
import { FORBIDDEN, OK } from "http-status"
import z from "zod"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import auth from "../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../server/schemas/errorReasons"
import useZod from "../../server/useZod"
import fetchFullCase from "../../useCases/fetchFullCase"

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
    [OK]: CaseSchema.openapi({ description: "A Case" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  },
  tags: ["Cases"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, db, reply, user }: HandlerProps) =>
  fetchFullCase(user, db, caseId)
    .then((foundCase) => {
      reply.code(OK).send(foundCase)
    })
    .catch((err) => {
      reply.log.error(err)
      reply.code(FORBIDDEN).send()
    })

// {
//  try {
//   const foundCase = await fetchFullCase(user, db, caseId)

//    reply.code(OK).send(foundCase)
//  } catch (err) {
//    reply.log.error(err)

//    reply.code(FORBIDDEN).send()
//   }
// }

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get("/cases/:caseId", { schema }, async (req, reply) => {
    await handler({
      caseId: Number(req.params.caseId),
      db: req.db,
      reply,
      user: req.user
    })
  })
}

export default route
