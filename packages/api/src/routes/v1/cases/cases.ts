import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { CaseIndexMetadataSchema } from "@moj-bichard7/common/types/Case"
import { INTERNAL_SERVER_ERROR, OK } from "http-status"
import z from "zod"

import type DataStoreGateway from "../../../services/gateways/interfaces/dataStoreGateway"
import type { Pagination } from "../../../types/Case"

import auth from "../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { convertCaseToCaseIndexDto } from "../../../useCases/dto/convertCaseToDto"

type HandlerProps = {
  dataStore: DataStoreGateway
  query: CaseIndexQuerystring
  reply: FastifyReply
  user: User
}

const CaseIndexQuerystringSchema = z.object({
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  pageNum: z.coerce.number().min(1).default(1)
})

type CaseIndexQuerystring = z.infer<typeof CaseIndexQuerystringSchema>

// TODO: Add e2e tests
// TODO: Add query string
const schema = {
  ...auth,
  querystring: CaseIndexQuerystringSchema,
  response: {
    [OK]: CaseIndexMetadataSchema,
    ...unauthorizedError,
    ...forbiddenError,
    ...notFoundError,
    ...unprocessableEntityError,
    ...internalServerError
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ dataStore, query, reply, user }: HandlerProps) => {
  // TODO: Create a Use Case
  const pagination: Pagination = { maxPerPage: query.maxPerPage, pageNum: query.pageNum }
  return dataStore
    .fetchCases(pagination)
    .then((cases) => {
      const casesDto = cases.map((caseData) => convertCaseToCaseIndexDto(caseData, user))
      const fullCount = cases.length === 0 ? 0 : Number(cases[0].full_count)
      return reply.code(OK).send({
        cases: casesDto,
        returnCases: cases.length,
        totalCases: fullCount,
        ...pagination
      } satisfies CaseIndexMetadata)
    })
    .catch((err) => {
      reply.log.error(err)
      return reply.code(INTERNAL_SERVER_ERROR).send()
    })
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Cases, { schema }, async (req, reply) => {
    await handler({
      dataStore: req.dataStore,
      query: req.query,
      reply,
      user: req.user
    })
  })
}

export default route
