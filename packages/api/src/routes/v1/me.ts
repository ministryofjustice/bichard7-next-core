import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { UserSchema } from "@moj-bichard7/common/types/User"
import { OK } from "http-status"

import { VersionedEndpoints } from "../../endpoints/versionedEndpoints"
import auth from "../../server/schemas/auth"
import { unauthorizedError } from "../../server/schemas/errorReasons"
import useZod from "../../server/useZod"

const schema = {
  ...auth,
  response: {
    [OK]: UserSchema.omit({ id: true, jwt_id: true, visible_forces: true }).openapi({
      description: "Returns details of authorised user"
    }),
    ...unauthorizedError
  },
  tags: ["Demo V1"]
} satisfies FastifyZodOpenApiSchema

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(VersionedEndpoints.V1Me, { schema }, async (request, res) => {
    res.code(OK).send(request.user)
  })
}

export default route
