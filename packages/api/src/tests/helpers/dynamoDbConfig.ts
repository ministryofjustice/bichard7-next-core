import type { DynamoDbConfig } from "../../services/gateways/dynamo"

const auditLogDynamoConfig: DynamoDbConfig = {
  auditLogTableName: "auditLogTable",
  credentials: {
    accessKeyId: "DUMMY",
    secretAccessKey: "DUMMY"
  },
  endpoint: "http://localhost:4566",
  eventsTableName: "auditLogEventsTable",
  region: "eu-west-2"
}

export default auditLogDynamoConfig
