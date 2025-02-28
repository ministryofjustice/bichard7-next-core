import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { CaseIndexMetadataSchema } from "@moj-bichard7/common/types/Case"
import { INTERNAL_SERVER_ERROR, OK } from "http-status"

import type DataStoreGateway from "../../../services/gateways/interfaces/dataStoreGateway"
import type { CaseIndexQuerystring } from "../../../types/CaseIndexQuerystring"

import auth from "../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../server/schemas/errorReasons"
import useZod from "../../../server/useZod"
import { CaseIndexQuerystringSchema } from "../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../../useCases/cases/fetchCasesAndFilter"

type HandlerProps = {
  dataStore: DataStoreGateway
  query: CaseIndexQuerystring
  reply: FastifyReply
  user: User
}

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
  await fetchCasesAndFilter(dataStore, query, user)
    .then((caseIndexMetaData) => {
      return reply.code(OK).send(caseIndexMetaData)
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
