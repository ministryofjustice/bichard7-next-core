import auth, { type FastifyAuthFunction } from "@fastify/auth"
import AutoLoad from "@fastify/autoload"
import bearerAuthPlugin from "@fastify/bearer-auth"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { fastify as Fastify } from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import fs from "fs"
import type { IncomingMessage, Server, ServerResponse } from "http"
import path from "path"
import logger from "./logger"

declare module "fastify" {
  interface FastifyInstance {
    allowAnonymous: FastifyAuthFunction
  }
}

export default async function () {
  let fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

  if (process.env.USE_SSL === "true") {
    fastify = Fastify({
      https: { key: fs.readFileSync("/certs/server.key"), cert: fs.readFileSync("/certs/server.crt") },
      logger: logger(process.env.NODE_ENV)
    })
  } else {
    fastify = Fastify({
      logger: logger(process.env.NODE_ENV)
    })
  }

  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Bichard API",
        description: "API documentation about Bichard",
        version: "0.0.1"
      },
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
          }
        }
      },
      servers: []
    },
    transform: jsonSchemaTransform
  })

  await fastify.register(swaggerUi, {
    baseDir: process.env.NODE_ENV === "development" ? undefined : path.resolve("static"),
    routePrefix: "/swagger"
  })

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
    await instance.register(bearerAuthPlugin, { keys, addHook: true })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("route")
    })
  })

  return fastify
}
