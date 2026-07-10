import type { FastifyInstance } from "fastify"

import AutoLoad from "@fastify/autoload"
import path from "node:path"

const addPublicRoutes = (fastify: FastifyInstance) => {
  fastify.register(async (instance: FastifyInstance) => {
    instance.addHook("onRequest", async (request) => {
      request.auditLogGateway = instance.auditLogGateway
      request.database = instance.database
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "..", "..", "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts"),
      matchFilter: (path: string) => path.includes("public")
    })
  })
}

export default addPublicRoutes
