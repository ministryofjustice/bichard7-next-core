import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { BAD_GATEWAY, FORBIDDEN, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { jsonResponse } from "../../../server/openapi/jsonResponse"
import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import handleDisconnectedError from "../../../services/db/handleDisconnectedError"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import canUserResubmitCase from "../../../useCases/cases/resubmit/canUserResubmitCase"

const bodySchema = z.object({ phase: z.number().gt(0).lte(3) })

export type ResubmitBody = z.infer<typeof bodySchema>

type HandlerProps = { body: ResubmitBody; caseId: number; database: DatabaseGateway; reply: FastifyReply; user: User }

const schema = {
  ...auth,
  body: bodySchema,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: jsonResponse(
      "Successful Resubmit",
      z
        .object({ phase: z.number().gt(0).lte(3).meta({ description: "Confirmation of the Phase" }) })
        .meta({ description: "Successful Resubmit" })
    ),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ body, caseId, database, reply, user }: HandlerProps) => {
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

  const canResubmitCase = await canUserResubmitCase(database.readonly, user, caseId)

  if (!isError(canResubmitCase) && canResubmitCase) {
    return reply.code(OK).send({ phase: body.phase })
  }

  reply.log.error(canResubmitCase)

  switch (true) {
    case canResubmitCase instanceof NotFoundError:
      return reply.code(NOT_FOUND).send()
    case canResubmitCase instanceof UnprocessableEntityError:
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: canResubmitCase.message, statusCode: UNPROCESSABLE_ENTITY })
    case handleDisconnectedError(canResubmitCase):
      return reply.code(BAD_GATEWAY).send()
    default:
      return reply.code(FORBIDDEN).send()
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CaseResubmit, { schema }, async (req, reply) => {
    await handler({
      body: req.body,
      caseId: Number(req.params.caseId),
      database: req.database,
      reply,
      user: req.user
    })
  })
}

export default route
