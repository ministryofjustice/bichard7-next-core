import type { FastifyInstance, RouteShorthandOptions } from "fastify"
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"
import { OK } from "http-status"
import { z } from "zod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema: FastifyZodOpenApiSchema = {
  description: "Health endpoint",
  tags: ["Health"],
  security: [],
  response: {
    [OK]: z.string().openapi({
      description: "Health check will return Ok"
    })
  }
}

const options: RouteShorthandOptions = {
  schema,
  logLevel: "silent"
}

const plugin = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(HealthRoutes.HEALTH, options, healthHandler)
}

export default plugin
