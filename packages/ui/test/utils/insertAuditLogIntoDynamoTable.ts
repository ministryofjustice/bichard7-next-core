import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

const workspace = process.env.WORKSPACE
const tableName = workspace ? `bichard-7-${workspace}-audit-log` : "auditLogTable"
const config = {
  region: "eu-west-2",
  ...(workspace
    ? {}
    : {
        endpoint: "http://localhost:4566",
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER"
      })
}

const insertAuditLogIntoDynamoTable = async <T>(records: T[]) => {
  const dynamoDb = new DynamoDB(config)
  const client = new DocumentClient({
    service: dynamoDb
  })

  const params: DocumentClient.TransactWriteItemsInput = {
    TransactItems: records.map((record) => {
      return {
        Put: {
          TableName: tableName,
          Item: { _: "_", ...record },
          ConditionExpression: `attribute_not_exists(messageId)`
        }
      }
    })
  }

  return client
    .transactWrite(params)
    .promise()
    .then(() => {
      return undefined
    })
    .catch((error) => error)
}

export default insertAuditLogIntoDynamoTable
