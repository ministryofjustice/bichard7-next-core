import type { FastifyAuthFunction } from "@fastify/auth"
import auth from "@fastify/auth"
import AutoLoad from "@fastify/autoload"
import bearerAuthPlugin from "@fastify/bearer-auth"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import path from "path"
import createFastify from "./server/createFastify"
import setupSwagger from "./server/setupSwagger"

declare module "fastify" {
  interface FastifyInstance {
    allowAnonymous: FastifyAuthFunction
  }
}

export default async function () {
  const fastify = createFastify()

  // Set up Zod
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

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

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("route")
    })
  })

  return fastify
}
