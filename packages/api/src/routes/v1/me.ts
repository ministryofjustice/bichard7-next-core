import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserDtoSchema } from "@moj-bichard7/common/types/User"
import { OK } from "http-status"

import { jsonResponse } from "../../server/openapi/jsonResponse"
import auth from "../../server/schemas/auth"
import { unauthorizedError } from "../../server/schemas/errorReasons"
import useZod from "../../server/useZod"
import { convertUserToDto } from "../../useCases/dto/convertUserToDto"

const schema = {
  ...auth,
  response: {
    [OK]: jsonResponse("Current User", UserDtoSchema.meta({ description: "Returns details of authorised user" })),
    ...unauthorizedError()
  },
  tags: ["Demo V1"]
} satisfies FastifyZodOpenApiSchema

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Me, { schema }, async (request, res) => {
    const userDto = convertUserToDto(request.user)
    res.code(OK).send(userDto)
  })
}

export default route
