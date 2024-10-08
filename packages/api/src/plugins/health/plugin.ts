import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { OK } from "http-status"
import useZod from "server/useZod"
import { z } from "zod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema = {
  description: "Health endpoint",
  tags: ["Health"],
  security: [],
  response: {
    [OK]: z.string().openapi({
      description: "Health check will return Ok"
    })
  }
} satisfies FastifyZodOpenApiSchema

const plugin = async (fastify: FastifyInstance) => {
  useZod(fastify).get(HealthRoutes.HEALTH, { schema, logLevel: "silent" }, healthHandler)
}

export default plugin
