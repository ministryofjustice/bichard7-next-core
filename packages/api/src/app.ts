import type { User } from "@moj-bichard7/common/types/User"

import AutoLoad from "@fastify/autoload"
import path from "path"

import type { AuditLogDynamoGateway } from "./services/gateways/dynamo"
import type AwsS3Gateway from "./services/gateways/interfaces/awsS3Gateway"
import type DataStoreGateway from "./services/gateways/interfaces/dataStoreGateway"

import authenticate from "./server/auth/authenticate"
import createFastify from "./server/createFastify"
import setupSwagger from "./server/openapi/setupSwagger"
import setupZod from "./server/openapi/setupZod"

declare module "fastify" {
  interface FastifyRequest {
    auditLogGateway: AuditLogDynamoGateway
    dataStore: DataStoreGateway
    s3: AwsS3Gateway
    user: User
  }
}

type Gateways = {
  auditLogGateway: AuditLogDynamoGateway
  dataStore: DataStoreGateway
  s3?: AwsS3Gateway
}

export default async function ({ auditLogGateway, dataStore }: Gateways) {
  const fastify = createFastify()

  await setupZod(fastify)
  await setupSwagger(fastify)

  // Autoloaded plugins (no authentication)
  fastify.register(async (instance) => {
    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts"),
      matchFilter: (path: string) => path.includes("plugin")
    })
  })

  // Autoloaded API routes (bearer token required)
  fastify.register(async (instance) => {
    instance.addHook("onRequest", async (request, reply) => {
      await authenticate(dataStore, request, reply)
      request.auditLogGateway = auditLogGateway
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts")
    })
  })

  return fastify
}
