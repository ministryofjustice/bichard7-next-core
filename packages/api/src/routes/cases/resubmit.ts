import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { BAD_GATEWAY, BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import z from "zod"
import "zod-openapi/extend"
import auth from "../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../server/schemas/errorReasons"
import useZod from "../../server/useZod"
import handleDisconnectedError from "../../services/db/handleDisconnectedError"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import canUserResubmitCase from "../../useCases/canUserResubmitCase"

const bodySchema = z.object({
  phase: z.number().gt(0).lte(3)
})

export type ResubmitBody = z.infer<typeof bodySchema>

type HandlerProps = {
  dataStoreGateway: DataStoreGateway
  user: User
  caseId: number
  body: ResubmitBody
  reply: FastifyReply
}

const schema = {
  ...auth,
  tags: ["Cases"],
  params: z.object({
    caseId: z.string().openapi({
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

const handler = async ({ dataStoreGateway, user, caseId, body, reply }: HandlerProps) => {
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
  // ReceivedResubmittedHearingOutcome audit log event
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

  try {
    const result = await canUserResubmitCase({ dataStoreGateway, user, caseId })

    if (!result) {
      reply.code(FORBIDDEN).send()
      return
    }
  } catch (err) {
    reply.log.error(err)

    if (handleDisconnectedError(err)) {
      reply.code(BAD_GATEWAY).send()
      return
    }

    reply.code(BAD_REQUEST).send()
    return
  }

  reply.code(OK).send({ phase: body.phase })
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post("/cases/:caseId/resubmit", { schema }, async (req, reply) => {
    await handler({
      dataStoreGateway: req.dataStoreGateway,
      user: req.user,
      caseId: Number(req.params.caseId),
      body: req.body,
      reply
    })
  })
}

export default route
