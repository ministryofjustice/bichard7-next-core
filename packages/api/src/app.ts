import AutoLoad from "@fastify/autoload"
import type { User } from "@moj-bichard7/common/types/User"
import path from "path"
import authenticate from "./server/auth/authenticate"
import createFastify from "./server/createFastify"
import setupSwagger from "./server/openapi/setupSwagger"
import setupZod from "./server/openapi/setupZod"
import type AuditLogGateway from "./services/gateways/interfaces/auditLogGateway"
import type AwsS3Gateway from "./services/gateways/interfaces/awsS3Gateway"
import type DataStoreGateway from "./services/gateways/interfaces/dataStoreGateway"

declare module "fastify" {
  interface FastifyRequest {
    user: User
    db: DataStoreGateway
  }
}

type Gateways = {
  db: DataStoreGateway
  auditLogGateway?: AuditLogGateway
  awsS3Gateway?: AwsS3Gateway
}

export default async function ({ db }: Gateways) {
  const fastify = createFastify()

  await setupZod(fastify)
  await setupSwagger(fastify)

  // Autoloaded plugins (no authentication)
  fastify.register(async (instance) => {
    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      dirNameRoutePrefix: false,
      matchFilter: (path: string) => path.includes("plugin"),
      ignoreFilter: (path: string) => path.endsWith(".test.ts")
    })
  })

  // Autoloaded API routes (bearer token required)
  fastify.register(async (instance) => {
    instance.addHook("onRequest", async (request, reply) => {
      await authenticate(db, request, reply)
    })

    await instance.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      dirNameRoutePrefix: false,
      ignoreFilter: (path: string) => path.endsWith(".test.ts")
    })
  })

  return fastify
}
