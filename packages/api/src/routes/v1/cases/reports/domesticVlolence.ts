import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import {
  type DomesticViolenceReportQuery,
  DomesticViolenceReportQuerySchema
} from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import { CaseForDomesticViolenceReportDtoSchema } from "@moj-bichard7/common/types/reports/DomesticViolence"
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
import { generateDomesticViolenceReport } from "../../../../useCases/cases/reports/domesticViolence/generateDomesticViolenceReport"

type HandlerProps = {
  database: DatabaseGateway
  query: DomesticViolenceReportQuery
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  querystring: DomesticViolenceReportQuerySchema,
  response: {
    [OK]: jsonResponse("Domestic Violence Report", CaseForDomesticViolenceReportDtoSchema.array()),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ database, query, reply, user }: HandlerProps) => {
  const result = await generateDomesticViolenceReport(database, user, query, reply)

  if (!isError(result)) {
    return reply
  }

  return reply.code(FORBIDDEN).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.CasesReportsDomesticViolence, { schema }, async (req, reply) => {
    await handler({
      database: req.database,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
