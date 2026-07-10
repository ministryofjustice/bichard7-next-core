import type { User } from "@moj-bichard7/common/types/User"

import type { AuditLogDynamoGateway } from "./services/gateways/dynamo"
import type AwsS3Gateway from "./types/AwsS3Gateway"
import type DatabaseGateway from "./types/DatabaseGateway"

import createFastify from "./server/createFastify"
import addOnRequestHook from "./server/hooks/addOnRequestHook"
import addOnResponseHook from "./server/hooks/addOnResponseHook"
import addOnSendHook from "./server/hooks/addOnSendHook"
import setupSwagger from "./server/openapi/setupSwagger"
import setupZod from "./server/openapi/setupZod"
import addPrivateRoutes from "./server/register/addPrivateRoutes"
import addPublicRoutes from "./server/register/addPublicRoutes"

declare module "fastify" {
  interface FastifyInstance {
    auditLogGateway: AuditLogDynamoGateway
    database: DatabaseGateway
  }

  interface FastifyRequest {
    auditLogGateway: AuditLogDynamoGateway
    database: DatabaseGateway
    s3: AwsS3Gateway
    traceId: string
    user: User
  }
}

type Gateways = {
  auditLogGateway: AuditLogDynamoGateway
  database: DatabaseGateway
  s3?: AwsS3Gateway
}

export default async function ({ auditLogGateway, database }: Gateways) {
  const fastify = createFastify()

  fastify.decorate("database", database)
  fastify.decorate("auditLogGateway", auditLogGateway)

  await setupZod(fastify)
  await setupSwagger(fastify)

  addOnRequestHook(fastify)
  addOnSendHook(fastify)
  addOnResponseHook(fastify)

  addPublicRoutes(fastify)
  addPrivateRoutes(fastify)

  fastify.addHook("onClose", async (instance) => {
    await instance.database.readonly.connection.end()
    await instance.database.writable.connection.end()
  })

  return fastify
}
