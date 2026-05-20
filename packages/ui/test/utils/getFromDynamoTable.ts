import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

const getFromDynamo = async (tableName: string): Promise<AuditLogEvent[]> => {
  const client = new DocumentClient({
    endpoint: "http://localhost:4566",
    region: "eu-west-2",
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER"
  })

  const result = await client
    .scan({
      TableName: tableName
    })
    .promise()

  return (result.Items as AuditLogEvent[]) ?? []
}

export default getFromDynamo
