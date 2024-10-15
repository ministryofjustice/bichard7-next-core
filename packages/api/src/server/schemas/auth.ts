import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

const auth: FastifyZodOpenApiSchema = {
  security: [{ apiKey: [], bearerAuth: [] }]
}

export default auth
