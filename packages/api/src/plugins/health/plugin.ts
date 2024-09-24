import type { FastifyInstance, RouteShorthandOptions } from "fastify"
import { OK } from "http-status"
import { z } from "zod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema = {
  description: "Health endpoint",
  tags: ["Health"],
  security: [],
  response: {
    [OK]: z.string().describe("Health check will return Ok")
  }
}

const options: RouteShorthandOptions = {
  schema,
  logLevel: "silent"
}

const plugin = async (fastify: FastifyInstance) => {
  fastify.get(HealthRoutes.HEALTH, options, healthHandler)
}

export default plugin
