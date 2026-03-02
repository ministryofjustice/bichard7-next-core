import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { WarrantsReportQuerySchema } from "@moj-bichard7/common/contracts/WarrantsReport"
import { CaseForWarrantsReportDtoSchema } from "@moj-bichard7/common/types/reports/Warrants"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, OK } from "http-status"

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
import { generateWarrantsReport } from "../../../../useCases/cases/reports/warrants/generateWarrantsReport"

type HandlerProps = {
  database: DatabaseGateway
  query: WarrantsReportQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  querystring: WarrantsReportQuerySchema,
  response: {
    [OK]: jsonResponse("Warrants Report", CaseForWarrantsReportDtoSchema.array()),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, query, reply, user }: HandlerProps) => {
  const result = await generateWarrantsReport(database, user, query, reply)

  if (!isError(result)) {
    return reply
  }

  return reply.code(FORBIDDEN).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.CasesReportsWarrants, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
