import type { FastifyInstance } from "fastify"

const addOnSendHook = (fastify: FastifyInstance) => {
  fastify.addHook("onSend", async (request, reply, payload) => {
    reply.header("x-trace-id", request.traceId)

    return payload
  })
}

export default addOnSendHook
