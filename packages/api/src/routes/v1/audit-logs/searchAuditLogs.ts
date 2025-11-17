import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { STATUS_CODES } from "http"
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { AuditLogQueryParameters } from "../../../types/AuditLogQueryParameters"

import auth from "../../../server/schemas/auth"
import { forbiddenError, internalServerError, unauthorizedError } from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { OutputApiAuditLogSchema } from "../../../types/AuditLog"
import { AuditLogQueryParametersSchema } from "../../../types/AuditLogQueryParameters"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import fetchAuditLogs from "../../../useCases/fetchAuditLogs"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  logger: FastifyBaseLogger
  queryParameters: AuditLogQueryParameters
  reply: FastifyReply
}

const schema = {
  ...auth,
  querystring: AuditLogQueryParametersSchema,
  response: {
    [OK]: OutputApiAuditLogSchema.array().meta({ description: "No content" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...internalServerError()
  },
  tags: ["Audit Logs V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, logger, queryParameters, reply }: HandlerProps) =>
  fetchAuditLogs(queryParameters, auditLogGateway, logger)
    .then((result) => {
      if (!isError(result)) {
        reply.code(OK).send(result)
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
  useZod(fastify).get(V1.AuditLogs, { schema }, async (req, reply) => {
    await handler({ auditLogGateway: req.auditLogGateway, logger: req.log, queryParameters: req.query, reply })
  })
}

export default route
