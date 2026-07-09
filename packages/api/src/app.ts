import type { User } from "@moj-bichard7/common/types/User"

import AutoLoad from "@fastify/autoload"
import path from "node:path"

import type { AuditLogDynamoGateway } from "./services/gateways/dynamo"
import type AwsS3Gateway from "./types/AwsS3Gateway"
import type DatabaseGateway from "./types/DatabaseGateway"

import authenticate from "./server/auth/authenticate"
import createFastify from "./server/createFastify"
import addOnRequestHook from "./server/hooks/addOnRequestHook"
import addOnResponseHook from "./server/hooks/onResponse"
import addOnSendHook from "./server/hooks/onSend"
import setupSwagger from "./server/openapi/setupSwagger"
import setupZod from "./server/openapi/setupZod"

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

  // Autoloaded API routes (bearer token required)
  fastify.register(async (instance) => {
    instance.addHook("onRequest", async (request, reply) => {
      const authenticatedUser = await authenticate(instance.database.readonly, request, reply)
      if (!authenticatedUser) {
        return
      }

      request.auditLogGateway = instance.auditLogGateway
      request.database = instance.database
      request.user = authenticatedUser
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.includes("public") || path.endsWith(".test.ts")
    })
  })

  // Autoloaded Public API routes (no bearer token required)
  fastify.register(async (instance) => {
    instance.addHook("onRequest", async (request) => {
      request.auditLogGateway = instance.auditLogGateway
      request.database = instance.database
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts"),
      matchFilter: (path: string) => path.includes("public")
    })
  })

  fastify.addHook("onClose", async (instance) => {
    await instance.database.readonly.connection.end()
    await instance.database.writable.connection.end()
  })

  return fastify
}
