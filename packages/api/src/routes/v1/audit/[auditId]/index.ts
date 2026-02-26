import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { AuditWithProgressDtoSchema } from "@moj-bichard7/common/types/Audit"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status"
import z from "zod"

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
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import { getAuditWithProgress } from "../../../../useCases/audit/getAuditWithProgress"

type HandlerProps = {
  database: DatabaseGateway
  params: z.infer<typeof schema.params>
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  params: z.object({ auditId: z.coerce.number().meta({ description: "Audit ID" }) }),
  response: {
    [OK]: jsonResponse("Audit", AuditWithProgressDtoSchema),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Audit V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, params, reply, user }: HandlerProps) => {
  const result = await getAuditWithProgress(database.writable, params.auditId, user)
  if (isError(result)) {
    reply.log.error(result)

    if (result instanceof NotAllowedError) {
      return reply.code(FORBIDDEN).send()
    }

    if (result instanceof NotFoundError) {
      return reply.code(NOT_FOUND).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(OK).send(result)
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.AuditById, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      params: req.params,
      reply,
      user: req.user
    })
  })
}

export default route
