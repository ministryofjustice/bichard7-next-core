import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

const authSchema: FastifyZodOpenApiSchema = {
  security: [{ apiKey: [], bearerAuth: [] }]
}

export default authSchema
