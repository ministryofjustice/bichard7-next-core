import type { FastifyAuthFunction } from "@fastify/auth"
import auth from "@fastify/auth"
import AutoLoad from "@fastify/autoload"
import bearerAuthPlugin from "@fastify/bearer-auth"
import path from "path"
import createFastify from "./server/createFastify"
import jwtParser from "./server/jwtParser"
import jwtVerify from "./server/jwtVerify"
import setupSwagger from "./server/setupSwagger"
import setupZod from "./server/setupZod"

declare module "fastify" {
  interface FastifyInstance {
    allowAnonymous: FastifyAuthFunction
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
    const keys = new Set<string>([process.env.API_KEY ?? "password"])

    await instance.register(auth)
    await instance.register(bearerAuthPlugin, { keys })

    instance.addHook("onRequest", async (request, reply) => {
      const jwt = await jwtParser(request, reply)
      await jwtVerify(jwt, reply)
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("route")
    })
  })

  return fastify
}
