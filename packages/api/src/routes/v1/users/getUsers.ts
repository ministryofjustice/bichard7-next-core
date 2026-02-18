import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserListSchema } from "@moj-bichard7/common/types/User"
import { OK } from "http-status"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import fetchUserList from "../../../useCases/users/fetchUserList"

type HandlerProps = {
  database: DatabaseGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  response: {
    [OK]: UserListSchema.meta({ description: "List of users" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Users V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, logger, reply, user }: HandlerProps) => {
  const userList = await fetchUserList(database.readonly, user, logger)
  if (!isError(userList)) {
    reply.code(OK).send(userList)
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Users, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      logger: req.log,
      reply,
      user: req.user
    })
  })
}

export default route
