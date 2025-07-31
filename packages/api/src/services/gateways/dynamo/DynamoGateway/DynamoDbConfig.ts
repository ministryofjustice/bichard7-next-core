import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"

type DynamoDbConfig = DynamoDBClientConfig & {
  auditLogTableName: string
  eventsTableName: string
}

export default DynamoDbConfig
