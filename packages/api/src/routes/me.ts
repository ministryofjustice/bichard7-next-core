import { UserSchema } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { OK } from "http-status"
import createZodProvider from "../server/createZodProvider"
import auth from "../server/schemas/auth"
import { unauthorizedError } from "../server/schemas/errorReasons"

const schema = {
  ...auth,
  tags: ["Root"],
  response: {
    [OK]: UserSchema.openapi({
      description: "Returns details of authorised user"
    }),
    ...unauthorizedError
  }
} satisfies FastifyZodOpenApiSchema

const route = async (fastify: FastifyInstance) => {
  createZodProvider(fastify).get("/me", { schema }, async (request, res) => {
    res.code(OK).send(request.user)
  })
}

export default route
