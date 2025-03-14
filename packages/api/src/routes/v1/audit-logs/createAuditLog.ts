import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { STATUS_CODES } from "http"
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR } from "http-status"
import z from "zod"

import type AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGatewayInterface"
import type { InputApiAuditLog } from "../../../types/AuditLog"

import auth from "../../../server/schemas/auth"
import {
  conflictError,
  forbiddenError,
  internalServerError,
  unauthorizedError
} from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { InputApiAuditLogSchema } from "../../../types/AuditLog"
import ConflictError from "../../../types/errors/ConflictError"
import createAuditLog from "../../../useCases/createAuditLog"

type HandlerProps = {
  auditLog: InputApiAuditLog
  auditLogGateway: AuditLogDynamoGateway
  logger: FastifyBaseLogger
  reply: FastifyReply
}

const schema = {
  ...auth,
  body: InputApiAuditLogSchema,
  response: {
    [CREATED]: z.null().openapi({ description: "No content" }),
    ...unauthorizedError,
    ...forbiddenError,
    ...internalServerError,
    ...conflictError
  },
  tags: ["Audit Logs V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLog, auditLogGateway, logger, reply }: HandlerProps) =>
  createAuditLog(auditLog, auditLogGateway, logger)
    .then((result) => {
      if (!result) {
        reply.code(CREATED).send()
      } else if (result instanceof ConflictError) {
        reply.code(CONFLICT).send({ code: STATUS_CODES[409], message: result.message, statusCode: 409 })
      } else {
        reply.code(INTERNAL_SERVER_ERROR).send(result)
      }
    })
    .catch((err) => {
      reply.log.error(err)
      reply.code(INTERNAL_SERVER_ERROR).send()
    })

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.AuditLogs, { schema }, async (req, reply) => {
    await handler({ auditLog: req.body, auditLogGateway: req.auditLogGateway, logger: req.log, reply })
  })
}

export default route
