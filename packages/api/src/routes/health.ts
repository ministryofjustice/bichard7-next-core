import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

const schema = {
  response: {
    200: z.string().describe("Health check will return Ok")
  }
}

export default async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get("/health", { schema }, async (_, res) => {
    res.send("Ok")
  })
}
