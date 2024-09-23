import AutoLoad from "@fastify/autoload"
import type { User } from "@moj-bichard7/common/types/User"
import path from "path"
import authenticate from "./server/authenticate"
import createFastify from "./server/createFastify"
import setupSwagger from "./server/setupSwagger"
import setupZod from "./server/setupZod"

declare module "fastify" {
  interface FastifyRequest {
    user: User
  }
}

export default async function () {
  const fastify = createFastify()

  await setupZod(fastify)
  await setupSwagger(fastify)

  // Autoloaded plugins (no authentication)
  fastify.register(async (instance) => {
    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("plugin")
    })
  })

  // Autoloaded API routes (bearer token required)
  fastify.register(async (instance) => {
    instance.addHook("onRequest", async (request, reply) => {
      await authenticate(request, reply)
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("route")
    })
  })

  return fastify
}
