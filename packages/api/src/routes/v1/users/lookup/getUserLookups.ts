import type { ApiUserLookupQuery } from "@moj-bichard7/common/types/ApiUserLookupQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ApiUserLookupQuerySchema } from "@moj-bichard7/common/types/ApiUserLookupQuery"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserLookupListSchema } from "@moj-bichard7/common/types/User"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from "http-status"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import auth from "../../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { NotAllowedError } from "../../../../types/errors/NotAllowedError"
import fetchUserLookupList from "../../../../useCases/users/fetchUserLookupList"

type HandlerProps = {
  database: DatabaseGateway
  logger: FastifyBaseLogger
  query: ApiUserLookupQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  querystring: ApiUserLookupQuerySchema,
  response: {
    [OK]: UserLookupListSchema.meta({ description: "List of user lookups" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Users V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, logger, query, reply, user }: HandlerProps) => {
  const userList = await fetchUserLookupList(database.readonly, user, logger, query)

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
  useZod(fastify).get(V1.UsersLookup, { schema }, async (req, reply) => {
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
