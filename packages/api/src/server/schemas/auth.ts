import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

const auth: FastifyZodOpenApiSchema = {
  security: [{ bearerAuth: [] }]
}

export default auth
