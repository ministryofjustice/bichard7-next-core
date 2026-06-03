import type { ApiUsersQuery } from "@moj-bichard7/common/types/ApiUsersQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ApiUsersQuerySchema } from "@moj-bichard7/common/types/ApiUsersQuery"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserListSchema } from "@moj-bichard7/common/types/User"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from "http-status"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import fetchUserList from "../../../useCases/users/fetchUserList"

type HandlerProps = {
  database: DatabaseGateway
  logger: FastifyBaseLogger
  query: ApiUsersQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  querystring: ApiUsersQuerySchema,
  response: {
    [OK]: UserListSchema.meta({ description: "List of users" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Users V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, logger, query, reply, user }: HandlerProps) => {
  const userList = await fetchUserList(database.readonly, user, logger, query)

  if (isError(userList)) {
    reply.log.error(userList)

    if (userList instanceof NotAllowedError) {
      return reply.code(FORBIDDEN).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(OK).send(userList)
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Users, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      logger: req.log,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
