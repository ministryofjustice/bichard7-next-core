import authenticate from "@/server/auth/authenticate"
import createFastify from "@/server/createFastify"
import setupSwagger from "@/server/openapi/setupSwagger"
import setupZod from "@/server/openapi/setupZod"
import type Gateway from "@/services/gateways/interfaces/gateway"
import PostgresGateway from "@/services/gateways/postgresGateway"
import AutoLoad from "@fastify/autoload"
import type { User } from "@moj-bichard7/common/types/User"
import path from "path"

declare module "fastify" {
  interface FastifyRequest {
    user: User
    gateway: Gateway
  }
}

export default async function (gateway: Gateway = new PostgresGateway()) {
  const fastify = createFastify()

  await setupZod(fastify)
  await setupSwagger(fastify)

  // Autoloaded plugins (no authentication)
  fastify.register(async (instance) => {
    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("plugin"),
      ignoreFilter: (path: string) => path.endsWith(".test.ts")
    })
  })

  // Autoloaded API routes (bearer token required)
  fastify.register(async (instance) => {
    instance.addHook("onRequest", async (request, reply) => {
      await authenticate(gateway, request, reply)
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts")
    })
  })

  return fastify
}
