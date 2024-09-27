import { UserSchema } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi"
import { OK } from "http-status"
import auth from "../server/schemas/auth"
import { unauthorizedError } from "../server/schemas/errorReasons"

const schema: FastifyZodOpenApiSchema = {
  ...auth,
  tags: ["Root"],
  response: {
    [OK]: UserSchema.openapi({
      description: "Returns details of authorised user"
    }),
    ...unauthorizedError
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
