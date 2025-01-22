import build from "./app"
import Postgres from "./services/gateways/dataStoreGateways/postgres"
import AuditLogDynamoGateway from "./services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "./services/gateways/dynamo/createAuditLogDynamoDbConfig"

async function start() {
  const port: number = parseInt(process.env.PORT ?? "3321", 10)

  const dynamoConfig = createAuditLogDynamoDbConfig()
  const auditLogGateway = new AuditLogDynamoGateway(dynamoConfig)

  const app = await build({ auditLogGateway, db: new Postgres() })

  await app.ready()

  app.listen({ host: "0.0.0.0", port })
}

start()
