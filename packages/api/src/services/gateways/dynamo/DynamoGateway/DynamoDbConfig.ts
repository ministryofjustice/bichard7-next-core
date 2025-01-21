type DynamoDbConfig = {
  accessKeyId?: string
  auditLogTableName: string
  endpoint: string
  eventsTableName: string
  region: string
  secretAccessKey?: string
}

export default DynamoDbConfig
