import type { FullUserRow } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { BAD_GATEWAY, BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import z from "zod"
import "zod-openapi/extend"

import type DataStoreGateway from "../../../services/gateways/interfaces/dataStoreGateway"

import { V1 } from "../../../endpoints/versionedEndpoints"
import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import handleDisconnectedError from "../../../services/db/handleDisconnectedError"
import canUserResubmitCase from "../../../useCases/canUserResubmitCase"

const bodySchema = z.object({
  phase: z.number().gt(0).lte(3)
})

export type ResubmitBody = z.infer<typeof bodySchema>

type HandlerProps = {
  body: ResubmitBody
  caseId: number
  db: DataStoreGateway
  reply: FastifyReply
  user: FullUserRow
}

const schema = {
  ...auth,
  body: bodySchema,
  params: z.object({
    caseId: z.string().openapi({
      description: "Case ID"
    })
  }),
  response: {
    [OK]: z
      .object({ phase: z.number().gt(0).lte(3).openapi({ description: "Confirmation of the Phase" }) })
      .openapi({ description: "Worked" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ body, caseId, db, reply, user }: HandlerProps) => {
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
    const result = await canUserResubmitCase({ caseId, db, user })

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
  useZod(fastify).post(V1.CaseResubmit, { schema }, async (req, reply) => {
    await handler({
      body: req.body,
      caseId: Number(req.params.caseId),
      db: req.db,
      reply,
      user: req.user
    })
  })
}

export default route
