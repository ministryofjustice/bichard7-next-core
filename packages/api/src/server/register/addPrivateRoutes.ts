import type { FastifyInstance } from "fastify"

import AutoLoad from "@fastify/autoload"
import path from "node:path"

import authenticate from "../auth/authenticate"

const addPrivateRoutes = (fastify: FastifyInstance) => {
  fastify.register(async (instance: FastifyInstance) => {
    instance.addHook("onRequest", async (request, reply) => {
      const authenticatedUser = await authenticate(instance.database.readonly, request, reply)
      if (!authenticatedUser) {
        return
      }

      request.auditLogGateway = instance.auditLogGateway
      request.database = instance.database
      request.user = authenticatedUser
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "..", "..", "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.includes("public") || path.endsWith(".test.ts")
    })
  })
}

export default addPrivateRoutes
