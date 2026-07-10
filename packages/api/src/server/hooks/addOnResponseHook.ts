import type { FastifyInstance } from "fastify"

const addOnResponseHook = (fastify: FastifyInstance) => {
  fastify.addHook("onResponse", (request, reply) => {
    request.log.info(
      {
        responseTime: reply.elapsedTime,
        statusCode: reply.statusCode
      },
      "request completed"
    )
  })
}

export default addOnResponseHook
