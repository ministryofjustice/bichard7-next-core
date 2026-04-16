import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ApiConnectivityDtoSchema } from "@moj-bichard7/common/types/ApiConnectivity"
import { isError } from "@moj-bichard7/common/types/Result"
import { OK, UNAUTHORIZED } from "http-status"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { jsonResponse } from "../../../server/openapi/jsonResponse"
import useZod from "../../../server/useZod"
import checkConnectivity from "../../../useCases/checkConnectivity"

type HandlerProps = {
  database: DatabaseGateway
  reply: FastifyReply
  req: FastifyRequest
}

const schema = {
  response: {
    [OK]: jsonResponse("Connectivity", ApiConnectivityDtoSchema.meta({ description: "Returns connection status" }))
  },
  tags: ["Connectivity"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, reply, req }: HandlerProps) => {
  const connectivityKey = req.headers["x-connectivity-key"]
  if (!connectivityKey || connectivityKey !== "test-connectivity-key") {
    return reply.code(UNAUTHORIZED).send("Unauthorized")
  }

  const connectivtyDto = await checkConnectivity(database.readonly)
  if (isError(connectivtyDto)) {
    reply.log.error(connectivtyDto)

    return reply.code(500)
  }

  return reply.code(OK).send(connectivtyDto)
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Connectivity, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      reply,
      req
    })
  })
}

export default route
