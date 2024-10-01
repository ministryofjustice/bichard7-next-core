import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import { FORBIDDEN, OK } from "http-status"
import z from "zod"
import "zod-openapi/extend"
import auth from "../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../server/schemas/errorReasons"
import useZod from "../../server/useZod"
import formatForceNumbers from "../../services/formatForceNumbers"
import type Gateway from "../../services/gateways/interfaces/gateway"

const bodySchema = z.object({
  phase: z.number().gt(0).lte(3)
})

type Body = z.infer<typeof bodySchema>

type HandlerProps = {
  gateway: Gateway
  user: User
  caseId: number
  body: Body
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

const handler = async ({ gateway, user, caseId, body, reply }: HandlerProps) => {
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

  if (
    !user.groups.some(
      (group) =>
        group === UserGroup.ExceptionHandler ||
        group === UserGroup.GeneralHandler ||
        group === UserGroup.Allocator ||
        group === UserGroup.Supervisor
    )
  ) {
    reply.code(FORBIDDEN).send()
    return
  }

  const forceNumbers = formatForceNumbers(user.visible_forces)

  try {
    await gateway.filterUserHasSameForceAsCaseAndLockedByUser(user.username, caseId, forceNumbers)
  } catch (err) {
    reply.log.error(err)
    reply.code(FORBIDDEN).send()
    return
  }

  reply.code(OK).send({ phase: body.phase })
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post("/cases/:caseId/resubmit", { schema }, async (req, reply) => {
    await handler({
      gateway: req.gateway,
      user: req.user,
      caseId: Number(req.params.caseId),
      body: req.body,
      reply
    })
  })
}

export default route
