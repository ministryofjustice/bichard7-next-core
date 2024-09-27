import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { OK } from "http-status"
import z from "zod"
import "zod-openapi/extend"
import auth from "../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../server/schemas/errorReasons"
import useZod from "../../server/useZod"

const bodySchema = z.object({
  phase: z.number().gt(0).lte(3)
})

type Body = z.infer<typeof bodySchema>

const schema = {
  ...auth,
  tags: ["Cases"],
  params: z.object({
    id: z.string().openapi({
      description: "Case ID"
    })
  }),
  body: bodySchema,
  response: {
    [OK]: z
      .object({ phase: z.number().gt(0).lte(3).openapi({ description: "Confirmation of the Phase" }) })
      .openapi({ description: "Worked" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  }
} satisfies FastifyZodOpenApiSchema

const handler = async (body: Body, reply: FastifyReply) => {
  // validate the request
  // - user must have one of the following roles:
  //   - Exception handler
  //   - General handler
  //   - Supervisor
  //   - Allocator
  // - case is in the same force as the user (not sure if needed)
  // - exception lock owner is the user requesting resubmission
  // - case must be unresolved
  //
  // success - 202
  // invalid = 403
  //
  // start resubmission workflow
  // - pull case from DB
  // - stream updated_msg to S3 file in incoming message bucket
  //
  // upload failed = 500
  // - in theory this should either be 502 or 504

  reply.code(OK).send({ phase: body.phase })
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post("/cases/:id/resubmit", { schema }, async (req, reply) => {
    await handler(req.body, reply)
  })
}

export default route
