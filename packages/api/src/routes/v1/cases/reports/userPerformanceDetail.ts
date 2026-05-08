import type { UserPerformanceDetailReportQuery } from "@moj-bichard7/common/contracts/UserPerformanceDetailReportQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserPerformanceDetailReportQuerySchema } from "@moj-bichard7/common/contracts/UserPerformanceDetailReportQuery"
import { UserPerformanceDetailDtoSchema } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, OK } from "http-status"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { jsonResponse } from "../../../../server/openapi/jsonResponse"
import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { generateUserPerformanceDetailReport } from "../../../../useCases/cases/reports/usersDetail/generateUserPerformanceDetailReport"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  database: DatabaseGateway
  query: UserPerformanceDetailReportQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  querystring: UserPerformanceDetailReportQuerySchema,
  response: {
    [OK]: jsonResponse("Users Performance Detail Report", UserPerformanceDetailDtoSchema.array()),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ auditLogGateway, database, query, reply, user }: HandlerProps) => {
  const result = await generateUserPerformanceDetailReport(database, auditLogGateway, user, query, reply)

  if (!isError(result)) {
    return reply
  }

  return reply.code(FORBIDDEN).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.CasesReportsUserPerformanceDetail, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      database: req.database,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
