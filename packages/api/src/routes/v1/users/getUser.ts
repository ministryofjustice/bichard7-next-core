import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserDtoSchema } from "@moj-bichard7/common/types/User"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import fetchUser from "../../../useCases/users/fetchUser"

type HandlerProps = {
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
  userId: number
}

const schema = {
  ...auth,
  params: z.object({ userId: z.coerce.number().meta({ description: "User ID" }) }),
  response: {
    [OK]: UserDtoSchema.meta({ description: "Get user" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Users V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, logger, reply, user, userId }: HandlerProps) => {
  const result = await fetchUser(database.readonly, user, logger, userId)

  if (isError(result)) {
    reply.log.error(result)

    if (result instanceof NotAllowedError) {
      return reply.code(FORBIDDEN).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(OK).send(result)
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.User, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      logger: req.log,
      reply,
      user: req.user,
      userId: Number(req.params.userId)
    })
  })
}

export default route
