import { UserSchema } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { OK } from "http-status"
import auth from "../server/schemas/auth"
import { unauthorizedError } from "../server/schemas/errorReasons"
import withTypeProvider from "../server/withTypeProvider"

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
  fastify.withZodTypeProvider.get("/me", { schema }, async (request, res) => {
    res.code(OK).send(request.user)
  })
}

export default route
