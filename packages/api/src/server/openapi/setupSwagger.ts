import type { FastifyInstance } from "fastify"

import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { fastifyZodOpenApiTransform } from "fastify-zod-openapi"
import path from "path"

export default async function (fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      components: {
        securitySchemes: {
          bearerAuth: {
            description: 'Authorization header token, sample: "Bearer #JWT#"',
            in: "header",
            name: "Authorization",
            type: "apiKey"
          }
        }
      },
      info: {
        description: "API documentation about Bichard",
        title: "Bichard API",
        version: "0.0.1"
      },
      openapi: "3.1.0",
      servers: [],
      tags: [
        { description: "Audit Logs endpoints", name: "Audit Logs V1" },
        { description: "Cases endpoints", name: "Cases V1" },
        { description: "Health endpoint", name: "Health V1" },
        { description: "Demo endpoints", name: "Demo V1" }
      ]
    },
    transform: fastifyZodOpenApiTransform
  })

  await fastify.register(swaggerUi, {
    baseDir: process.env.NODE_ENV === "development" ? undefined : path.resolve("static"),
    routePrefix: "/swagger"
  })
}
