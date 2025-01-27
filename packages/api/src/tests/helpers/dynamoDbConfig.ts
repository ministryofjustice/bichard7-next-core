import type { DynamoDbConfig } from "../../services/gateways/dynamo"

const auditLogDynamoConfig: DynamoDbConfig = {
  accessKeyId: "DUMMY",
  auditLogTableName: "auditLogTable",
  endpoint: "http://localhost:4566",
  eventsTableName: "auditLogEventsTable",
  region: "eu-west-2",
  secretAccessKey: "DUMMY"
}

export default auditLogDynamoConfig
