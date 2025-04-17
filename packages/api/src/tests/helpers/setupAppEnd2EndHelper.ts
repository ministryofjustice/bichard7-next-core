import type { FastifyInstance } from "fastify"

import build from "../../app"
import End2EndPostgres from "../testGateways/e2ePostgres"
import TestDynamoGateway from "../testGateways/TestDynamoGateway/TestDynamoGateway"
import auditLogDynamoConfig from "./dynamoDbConfig"

export class SetupAppEnd2EndHelper {
  readonly address: string

  constructor(
    readonly port: number,
    readonly app: FastifyInstance,
    readonly postgres: End2EndPostgres,
    readonly dynamo: TestDynamoGateway
  ) {
    this.address = `http://localhost:${port}`
  }

  static async setup(port: number = 8888): Promise<SetupAppEnd2EndHelper> {
    const e2ePostgres = new End2EndPostgres()
    const auditLogGateway = new TestDynamoGateway(auditLogDynamoConfig)
    const app = await build({ auditLogGateway, dataStore: e2ePostgres })
    await app.ready()
    await app.listen({ port })

    return new SetupAppEnd2EndHelper(port, app, e2ePostgres, auditLogGateway)
  }
}
