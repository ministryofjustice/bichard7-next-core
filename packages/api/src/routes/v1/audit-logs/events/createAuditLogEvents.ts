import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"
import type { ZodAny } from "zod"

import { STATUS_CODES } from "http"
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../../types/AuditLogEvent"

import { V1 } from "../../../../endpoints/versionedEndpoints"
import auth from "../../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { ApiAuditLogEventSchema } from "../../../../types/AuditLogEvent"
import ConflictError from "../../../../types/errors/ConflictError"
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import createAuditLogEvents from "../../../../useCases/createAuditLogEvents"

type HandlerProps = {
  auditLogEvents: ApiAuditLogEvent[]
  auditLogGateway: AuditLogDynamoGateway
  correlationId: string
  logger: FastifyBaseLogger
  reply: FastifyReply
}

const inputSchema = z.union([z.array(ApiAuditLogEventSchema), ApiAuditLogEventSchema])

const inputSchemaAsArray = inputSchema.transform((input) => {
  return Array.isArray(input) ? input : [input]
}) as unknown as ZodAny

const schema = {
  ...auth,
  body: inputSchemaAsArray,
  params: z.object({
    correlationId: z.string().openapi({
      description: "Correlation ID"
    })
  }),
  response: {
    [CREATED]: z.null().openapi({ description: "No content" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError
  },
  tags: ["Audit Logs V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogEvents, auditLogGateway, correlationId, logger, reply }: HandlerProps) =>
  createAuditLogEvents(auditLogEvents, correlationId, auditLogGateway, logger)
    .then((result) => {
      if (!result) {
        reply.code(CREATED).send()
      } else if (result instanceof ConflictError) {
        reply.code(CONFLICT).send({
          code: STATUS_CODES[CONFLICT],
          message: result.message,
          statusCode: CONFLICT
        })
      } else if (result instanceof NotFoundError) {
        reply.code(NOT_FOUND).send({
          code: STATUS_CODES[NOT_FOUND],
          message: result.message,
          statusCode: NOT_FOUND
        })
      } else {
        reply.code(INTERNAL_SERVER_ERROR).send(result)
      }
    })
    .catch((err) => {
      reply.log.error(err)
      reply.code(INTERNAL_SERVER_ERROR).send()
    })

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.AuditLogEvents, { schema }, async (req, reply) => {
    await handler({
      auditLogEvents: req.body as ApiAuditLogEvent[],
      auditLogGateway: req.auditLogGateway,
      correlationId: req.params.correlationId,
      logger: req.log,
      reply
    })
  })
}

export default route
