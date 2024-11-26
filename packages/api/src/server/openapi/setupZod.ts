import "zod-openapi/extend"

import type { FastifyInstance } from "fastify"

import { fastifyZodOpenApiPlugin, serializerCompiler, validatorCompiler } from "fastify-zod-openapi"
import { z, ZodError } from "zod"
import { extendZodWithOpenApi } from "zod-openapi"

extendZodWithOpenApi(z)

export default async function (fastify: FastifyInstance) {
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  fastify.register(fastifyZodOpenApiPlugin)

  fastify.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send({
        error: "Bad Request",
        issues: error.issues,
        statusCode: 400
      })
      return
    }

    reply.send(error)
  })
}
