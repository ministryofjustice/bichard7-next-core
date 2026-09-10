import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { OK } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"

type HandlerProps = {
  caseId: number
  database: DatabaseGateway
  forceCode: string
  note: string
  reply: FastifyReply
  user: User
}

// WIP: Fix and move to relevant place
export const ReallocateSchema = z.object({
  errorId: z.number(),
  forceCode: z.string(),
  note: z.string(),
  userId: z.string()
})

const schema = {
  ...auth,
  body: ReallocateSchema,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: z.null().meta({ description: "Note successfully created" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, database, forceCode, note, reply, user }: HandlerProps) => {
  // const reallocateCaseResult = await reallocateCase(auditLogGateway, database.writable, user, logger, caseId, forceCode, note)
  // if (isError(reallocateCaseResult)) {
  //   reply.log.error(reallocateCaseResult)
  //   if (reallocateCaseResult instanceof NotFoundError) {
  //     return reply.code(NOT_FOUND).send()
  //   }
  //   return reply.code(INTERNAL_SERVER_ERROR).send()
  // }
  // return reply.code(CREATED).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CasesReallocate, { schema }, async (req, reply) => {
    await handler({
      caseId: Number(req.params.caseId),
      database: req.database,
      forceCode: req.body.forceCode,
      note: req.body.note,
      reply,
      user: req.user
    })
  })
}

export default route
