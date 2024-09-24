import { UserSchema } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"
import { OK } from "http-status"

const schema: FastifyZodOpenApiSchema = {
  tags: ["Root"],

  // TODO: this will have to be included on every secure endpoint
  // might be worth finding a better solution
  security: [{ apiKey: [], bearerAuth: [] }],

  response: {
    [OK]: UserSchema.openapi({
      description: "Returns details of authorised user"
    })
  }
}

const route = async (fastify: FastifyInstance) => {
  fastify
    .withTypeProvider<FastifyZodOpenApiTypeProvider>()
    .get("/me", { schema, logLevel: "error" }, async (request, res) => {
      res.code(OK).send(request.user)
    })
}

export default route
