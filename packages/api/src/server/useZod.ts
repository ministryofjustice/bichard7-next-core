import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"

export default (fastify: FastifyInstance) => fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>()
