import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ApiConnectivityDtoSchema } from "@moj-bichard7/common/types/ApiConnectivity"
import { OK } from "http-status"

import { jsonResponse } from "../../server/openapi/jsonResponse"
import useZod from "../../server/useZod"

const schema = {
  response: {
    [OK]: jsonResponse("Connectivity", ApiConnectivityDtoSchema.meta({ description: "Returns connection status" }))
  },
  tags: ["Connectivity"]
} satisfies FastifyZodOpenApiSchema

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Connectivity, { schema }, async (_, res) => {
    const connectivtyDto = {
      conductor: true,
      database: true
    }
    res.code(OK).send(connectivtyDto)
  })
}

export default route
