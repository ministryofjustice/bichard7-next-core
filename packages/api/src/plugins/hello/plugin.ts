import type { FastifyInstance } from "fastify"
import type { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod"
import { OK } from "http-status"
import { z } from "zod"

const schema = {
  headers: z.object({
    authorization: z.string().optional().describe("Authorization token")
  }),
  querystring: z.object({
    name: z.string().min(4).describe("Name to say hello to")
  }),
  response: {
    [OK]: z.string().describe('Will return "Hello, $name"')
  }
}

// const handler: RouteHandlerMethod = async (req, res) => {
//   res.code(OK).send(`Hello, ${req.query.name}`)
// }

const options = (fastify: FastifyInstance) => {
  return {
    schema,
    preHandler: fastify.auth([fastify.verifyBearerAuth!])
    // handler
  }
}

const plugin: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get("/hello", options(fastify), async (req, res) => {
    res.code(OK).send(`Hello, ${req.query.name}`)
  })
}

export default plugin
// export default async (fastify: FastifyInstance) => {
//   fastify.withTypeProvider<ZodTypeProvider>().get("/hello", { schema }, async (req, res) => {
//     return res.code(OK).send(`Hello, ${req.query.name}`)
//   })
// }
