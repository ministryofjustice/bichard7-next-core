import type { FastifyInstance, RouteShorthandOptions } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { OK } from "http-status"
import { z } from "zod"
import withTypeProvider from "../../server/withTypeProvider"
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
  withTypeProvider(fastify).get(HealthRoutes.HEALTH, options, healthHandler)
}

export default plugin
