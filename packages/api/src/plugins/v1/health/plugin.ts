import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { OK } from "http-status"
import { z } from "zod"

import { V1 } from "../../../endpoints/versionedEndpoints"
import useZod from "../../../server/useZod"
import { healthHandler } from "./handlers"

const schema = {
  description: "Health endpoint",
  response: {
    [OK]: z.string().openapi({
      description: "Health check will return Ok"
    })
  },
  security: [],
  tags: ["Health V1"]
} satisfies FastifyZodOpenApiSchema

const plugin = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Health, { logLevel: "silent", schema }, healthHandler)
}

export default plugin
