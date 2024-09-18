import type { FastifyInstance } from "fastify"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OK } from "http-status"
import { z } from "zod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema = {
  security: [],
  response: {
    [OK]: z.string().describe("Health check will return Ok")
  }
}

const options = () => {
  return {
    schema,
    handler: healthHandler
  }
}

const plugin: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
  fastify.get(HealthRoutes.HEALTH, options())
}

export default plugin
