import type { FastifyInstance } from "fastify"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { OK } from "http-status"
import { z } from "zod"
import { healthHandler } from "./handlers"
import HealthRoutes from "./routes"

const schema = {
  response: {
    [OK]: z.string().describe("Health check will return Ok")
  }
}

const options = (fastify: FastifyInstance) => {
  console.log(`hasDecorator: ${fastify.hasDecorator("allowAnonymous")}`)

  return {
    schema,
    // preHandler: fastify.auth([
    //   (_req: FastifyRequest, _res: FastifyReply, done: () => void) => {
    //     console.log("In auth allowAnonymous")

    //     return done()
    //   }
    // ]),
    handler: healthHandler
  }
}

const plugin: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
  fastify.get(HealthRoutes.HEALTH, options(fastify))
}

export default plugin
