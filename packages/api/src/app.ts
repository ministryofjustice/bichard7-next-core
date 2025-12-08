import type { User } from "@moj-bichard7/common/types/User"

import AutoLoad from "@fastify/autoload"
import { createSerializerCompiler } from "fastify-zod-openapi"
import path from "path"

import type { AuditLogDynamoGateway } from "./services/gateways/dynamo"
import type AwsS3Gateway from "./types/AwsS3Gateway"
import type DatabaseGateway from "./types/DatabaseGateway"

import authenticate from "./server/auth/authenticate"
import createFastify from "./server/createFastify"
import setupSwagger from "./server/openapi/setupSwagger"
import setupZod from "./server/openapi/setupZod"

declare module "fastify" {
  interface FastifyRequest {
    auditLogGateway: AuditLogDynamoGateway
    database: DatabaseGateway
    s3: AwsS3Gateway
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

  await setupZod(fastify)
  await setupSwagger(fastify)

  fastify.setSerializerCompiler(
    createSerializerCompiler({
      stringify: JSON.stringify
    })
  )

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
      const authenticatedUser = await authenticate(database.readonly, request, reply)
      if (!authenticatedUser) {
        return
      }

      request.auditLogGateway = auditLogGateway
      request.database = database
      request.user = authenticatedUser
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts")
    })
  })

  fastify.addHook("onResponse", (request, reply) => {
    request.log.info(
      {
        request: {
          requestMethod: request.method,
          requestParams: request.params,
          url: request.url
        },
        response: {
          responseTime: reply.elapsedTime,
          statusCode: reply.statusCode
        }
      },
      "request completed"
    )
  })

  return fastify
}
