import auth, { type FastifyAuthFunction } from "@fastify/auth"
import AutoLoad from "@fastify/autoload"
import bearerAuthPlugin from "@fastify/bearer-auth"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { fastify as Fastify } from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import fs from "fs"
import type { IncomingMessage, Server, ServerResponse } from "http"
import path from "path"

declare module "fastify" {
  interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allowAnonymous: FastifyAuthFunction
  }
}

export default async function () {
  const keys = new Set<string>([process.env.API_KEY ?? "password"])
  let fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

  if (process.env.USE_SSL === "true") {
    fastify = Fastify({
      https: { key: fs.readFileSync("/certs/server.key"), cert: fs.readFileSync("/certs/server.crt") },
      logger: true
    })
  } else {
    let options = {}

    if (process.env.NODE_ENV !== "test") {
      options = { logger: true }
    }

    fastify = Fastify(options)
  }

  fastify.register(auth).register(bearerAuthPlugin, { keys, addHook: true })
  // .decorate("allowAnonymous", async function (_req: FastifyRequest, _res: FastifyReply) {
  //   console.log("In the decorate allowAnonymous")

  //   return true
  // })

  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Bichard API",
        description: "API documentation about Bichard",
        version: "0.0.1"
      },
      servers: []
    },
    transform: jsonSchemaTransform
  })

  await fastify.register(fastifySwaggerUI, {
    routePrefix: "/swagger"
  })

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    dirNameRoutePrefix: false,
    matchFilter: (path: string) => path.includes("plugin")
  })

  return fastify
}
