import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { jsonSchemaTransform } from "fastify-type-provider-zod"
import path from "path"

export default async function (fastify: FastifyInstance) {
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
            description: "API Key provided by UI",
            type: "apiKey",
            name: "X-API-Key",
            in: "header"
          },
          bearerAuth: {
            description: 'Authorization header token, sample: "Bearer #JWT#"',
            type: "apiKey",
            name: "Authorization",
            in: "header"
          }
        }
      },
      servers: [],
      tags: [
        {
          name: "Root",
          description: "Root endpoints"
        },
        {
          name: "Health",
          description: "Health endpoint"
        }
      ]
    },
    transform: jsonSchemaTransform
  })

  await fastify.register(swaggerUi, {
    baseDir: process.env.NODE_ENV === "development" ? undefined : path.resolve("static"),
    routePrefix: "/swagger"
  })
}
