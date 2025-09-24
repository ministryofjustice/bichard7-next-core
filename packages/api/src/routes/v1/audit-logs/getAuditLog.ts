import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { STATUS_CODES } from "http"
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"

import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { OutputApiAuditLogSchema } from "../../../types/AuditLog"
import { AuditLogQueryParametersSchema } from "../../../types/AuditLogQueryParameters"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import fetchAuditLogs from "../../../useCases/fetchAuditLogs"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  correlationId: string
  logger: FastifyBaseLogger
  queryParameters: QueryString
  reply: FastifyReply
}

const QueryStringSchema = AuditLogQueryParametersSchema.pick({
  eventsFilter: true,
  excludeColumns: true,
  includeColumns: true
})

type QueryString = z.infer<typeof QueryStringSchema>

const schema = {
  ...auth,
  params: z.object({ correlationId: z.string().meta({ description: "Correlation ID" }) }),
  querystring: QueryStringSchema,
  response: {
    [OK]: OutputApiAuditLogSchema.meta({ description: "No content" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Audit Logs V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, correlationId, logger, queryParameters, reply }: HandlerProps) =>
  fetchAuditLogs({ messageId: correlationId, ...queryParameters }, auditLogGateway, logger)
    .then((result) => {
      if (!isError(result)) {
        reply.code(OK).send(result[0])
      } else if (result instanceof NotFoundError) {
        reply.code(NOT_FOUND).send({ code: STATUS_CODES[NOT_FOUND], message: result.message, statusCode: NOT_FOUND })
      } else {
        reply.code(INTERNAL_SERVER_ERROR).send(result)
      }
    })
    .catch((err) => {
      reply.log.error(err)
      reply.code(INTERNAL_SERVER_ERROR).send()
    })

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.AuditLog, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      correlationId: req.params.correlationId,
      logger: req.log,
      queryParameters: req.query,
      reply
    })
  })
}

export default route
