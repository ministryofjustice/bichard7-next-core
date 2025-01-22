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
    readonly db: End2EndPostgres,
    readonly dynamo: TestDynamoGateway
  ) {
    this.address = `http://localhost:${port}`
  }

  static async setup(port: number = 8888): Promise<SetupAppEnd2EndHelper> {
    const db = new End2EndPostgres()
    const auditLogGateway = new TestDynamoGateway(auditLogDynamoConfig)
    const app = await build({ auditLogGateway, db })
    await app.ready()
    app.listen({ port })

    return new SetupAppEnd2EndHelper(port, app, db, auditLogGateway)
  }
}
