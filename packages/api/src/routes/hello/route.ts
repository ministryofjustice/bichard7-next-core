import type { FastifyInstance } from "fastify"
import type { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod"
import { OK } from "http-status"
import { z } from "zod"

const schema = {
  tags: ["Root"],
  security: [{ apiKey: [], bearerAuth: [] }],
  querystring: z.object({
    name: z.string().min(4).describe("Name to say hello to")
  }),
  response: {
    [OK]: z.string().describe('Will return "Hello, $name"')
  }
}

const plugin: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get("/hello", { schema }, async (req, res) => {
    res.code(OK).send(`Hello, ${req.user.username}`)
  })
}

export default plugin
