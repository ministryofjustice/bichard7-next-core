import type { FastifyInstance } from "fastify"
import type { ZodOpenApiVersion } from "zod-openapi"

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
      openapi: "3.1.0" satisfies ZodOpenApiVersion,
      servers: [],
      tags: [
        { description: "Cases endpoints", name: "Cases" },
        { description: "Health endpoint", name: "Health" },
        { description: "Root endpoints", name: "Root" }
      ]
    },
    transform: fastifyZodOpenApiTransform
  })

  await fastify.register(swaggerUi, {
    baseDir: process.env.NODE_ENV === "development" ? undefined : path.resolve("static"),
    routePrefix: "/swagger"
  })
}
