import type { FastifyInstance, RouteHandlerMethod } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

const schema: FastifyZodOpenApiSchema = {}

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
