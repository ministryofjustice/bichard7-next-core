import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"

const createZodProvider = (fastify: FastifyInstance) => fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>()

export default createZodProvider
