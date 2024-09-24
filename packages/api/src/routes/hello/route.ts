import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"
import { OK } from "http-status"
import { z } from "zod"

const schema: FastifyZodOpenApiSchema = {
  tags: ["Root"],

  // TODO: this will have to be included on every secure endpoint
  // might be worth finding a better solution
  security: [{ apiKey: [], bearerAuth: [] }],

  querystring: z.object({
    name: z.string().min(4).openapi({
      description: "Name to say hello to"
    })
  }),

  response: {
    [OK]: z.string().openapi({
      description: 'Will return "Hello, $name"'
    })
  }
}

const route = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get("/hello", { schema }, async (req, res) => {
    res.code(OK).send(`Hello, ${req.user.username}`)
  })
}

export default route
