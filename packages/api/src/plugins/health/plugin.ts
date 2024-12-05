import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { OK } from "http-status"
import { z } from "zod"

import useZod from "../../server/useZod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema = {
  description: "Health endpoint",
  response: {
    [OK]: z.string().openapi({
      description: "Health check will return Ok"
    })
  },
  security: [],
  tags: ["Health"]
} satisfies FastifyZodOpenApiSchema

const plugin = async (fastify: FastifyInstance) => {
  useZod(fastify).get(HealthRoutes.HEALTH, { logLevel: "silent", schema }, healthHandler)
}

export default plugin
