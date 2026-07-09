import type { FastifyInstance } from "fastify"

import { randomUUID } from "crypto"

const addOnRequestHook = (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", async (request) => {
    request.traceId = (request.headers["x-trace-id"] as string) || randomUUID()

    request.log = request.log.child({ traceId: request.traceId })

    request.log.info(
      {
        requestMethod: request.method,
        requestParams: request.params,
        requestQuery: request.query,
        url: request.url
      },
      "incoming request"
    )
  })
}

export default addOnRequestHook
