import type DynamoDbConfig from "./DynamoGateway/DynamoDbConfig"

export default function createAuditLogDynamoDbConfig(): DynamoDbConfig {
  const {
    AUDIT_LOG_EVENTS_TABLE_NAME,
    AUDIT_LOG_TABLE_NAME,
    AWS_REGION,
    AWS_URL,
    DYNAMO_AWS_ACCESS_KEY_ID,
    DYNAMO_AWS_SECRET_ACCESS_KEY
  } = process.env

  const config: DynamoDbConfig = {
    auditLogTableName: AUDIT_LOG_TABLE_NAME ?? "auditLogTable",
    endpoint: AWS_URL ?? "http://localhost:4566",
    eventsTableName: AUDIT_LOG_EVENTS_TABLE_NAME ?? "auditLogEventsTable",
    region: AWS_REGION ?? "eu-west-2"
  }

  if (DYNAMO_AWS_ACCESS_KEY_ID && DYNAMO_AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: DYNAMO_AWS_ACCESS_KEY_ID,
      secretAccessKey: DYNAMO_AWS_SECRET_ACCESS_KEY
    }
  }

  return config
}
