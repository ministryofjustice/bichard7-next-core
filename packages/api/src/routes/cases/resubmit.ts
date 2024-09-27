import type { FastifyInstance, RouteHandlerMethod } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { OK } from "http-status"
import z from "zod"
import auth from "../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../server/schemas/errorReasons"

const schema: FastifyZodOpenApiSchema = {
  ...auth,
  tags: ["Cases"],
  params: z.object({
    id: z.number().openapi({
      description: "Case ID"
    })
  }),
  response: {
    [OK]: z.null().openapi({ description: "Worked" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  }
}

const handler: RouteHandlerMethod = async (_request, _reply) => {
  // validate the request
  // - role check
  // - force check
  // - exception lock owner check
  //
  // invalid = 403
  //
  // start resubmission workflow
  // - pull case from DB
  // - stream updated_msg to S3 file in incoming message bucket
  //
  // upload failed = 500
  // - in theory this should either be 502 or 504
}

const route = async (fastify: FastifyInstance) => {
  fastify.post("/cases/:id/resubmit", { schema }, handler)
}

export default route
