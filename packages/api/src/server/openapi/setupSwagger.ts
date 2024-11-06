import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { fastifyZodOpenApiTransform, fastifyZodOpenApiTransformObject } from "fastify-zod-openapi"
import path from "path"
import type { ZodOpenApiVersion } from "zod-openapi"

export default async function (fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Bichard API",
        description: "API documentation about Bichard",
        version: "0.0.1"
      },
      openapi: "3.1.0" satisfies ZodOpenApiVersion,
      components: {
        securitySchemes: {
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
        { name: "Cases", description: "Cases endpoints" },
        { name: "Health", description: "Health endpoint" },
        { name: "Root", description: "Root endpoints" }
      ]
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject
  })

  await fastify.register(swaggerUi, {
    baseDir: process.env.NODE_ENV === "development" ? undefined : path.resolve("static"),
    routePrefix: "/swagger"
  })
}
