import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { OK } from "http-status"
import { z } from "zod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema = {
  response: {
    [OK]: z.string().describe("Health check will return Ok")
  }
}

export default async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get(HealthRoutes.HEALTH, { schema }, healthHandler)
}
