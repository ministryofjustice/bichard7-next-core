import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../types/DatabaseGateway"

import { jsonResponse } from "../../../server/openapi/jsonResponse"
import auth from "../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import saveAuditResults from "../../../useCases/cases/saveAuditResults"

const bodySchema = z
  .object({
    errorQuality: z.number().int().min(0).max(10).optional(),
    triggerQuality: z.number().int().min(0).max(10).optional()
  })
  .refine((data) => data.errorQuality !== undefined || data.triggerQuality !== undefined, {
    message: "At least one of errorQuality or triggerQuality must be provided"
  })

type AuditResultsBody = z.infer<typeof bodySchema>

type HandlerProps = { body: AuditResultsBody; caseId: number; database: DatabaseGateway; reply: FastifyReply }

const schema = {
  ...auth,
  body: bodySchema,
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: jsonResponse(
      "Saved audit results",
      z
        .object({ success: z.boolean().describe("Indicates results saved successfully") })
        .meta({ description: "Audit results saved successfully" })
    ),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Case V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ body, caseId, database, reply }: HandlerProps) => {
  const result = await saveAuditResults(database.writable, caseId, body)

  if (!isError(result)) {
    return reply.code(OK).send({ success: true })
  }

  reply.log.error(result)

  switch (true) {
    case result instanceof NotFoundError:
      return reply.code(NOT_FOUND).send()
    case result instanceof UnprocessableEntityError:
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: result.message, statusCode: UNPROCESSABLE_ENTITY })
    default:
      return reply
        .code(INTERNAL_SERVER_ERROR)
        .send({ code: `${INTERNAL_SERVER_ERROR}`, message: result.message, statusCode: INTERNAL_SERVER_ERROR })
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.CaseAudit, { schema }, async (req, reply) => {
    await handler({
      body: req.body,
      caseId: Number(req.params.caseId),
      database: req.database,
      reply
    })
  })
}

export default route
