import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"

const withTypeProvider = (fastify: FastifyInstance) => fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>()

export default withTypeProvider
