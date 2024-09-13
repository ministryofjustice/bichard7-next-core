import AutoLoad from "@fastify/autoload"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import { fastify as Fastify, type FastifyInstance } from "fastify"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import fs from "fs"
import type { IncomingMessage, Server, ServerResponse } from "http"
import path from "path"

const PORT: number = parseInt(process.env.PORT || "3333", 10)
let fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

if (process.env.USE_SSL === "true") {
  fastify = Fastify({
    https: { key: fs.readFileSync("/certs/server.key"), cert: fs.readFileSync("/certs/server.crt") },
    logger: true
  })
} else {
  fastify = Fastify({ logger: true })
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
  dir: path.join(__dirname, "routes"),
  dirNameRoutePrefix: false
})

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
