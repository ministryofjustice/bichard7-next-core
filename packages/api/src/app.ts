import AutoLoad from "@fastify/autoload"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import { fastify as Fastify, type FastifyInstance } from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import fs from "fs"
import type { IncomingMessage, Server, ServerResponse } from "http"
import path from "path"

export default async function () {
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

  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  fastify.register(fastifySwagger, {
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

  fastify.register(fastifySwaggerUI, {
    routePrefix: "/swagger"
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    dirNameRoutePrefix: false,
    matchFilter: (path: string) => path.includes("plugin")
  })

  return fastify
}
