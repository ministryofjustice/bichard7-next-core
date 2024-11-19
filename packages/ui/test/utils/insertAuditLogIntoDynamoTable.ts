import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

const workspace = process.env.WORKSPACE
const tableName = workspace ? `bichard-7-${workspace}-audit-log` : "auditLogTable"
const config = {
  region: "eu-west-2",
  ...(workspace
    ? {}
    : {
        accessKeyId: "S3RVER",
        endpoint: "http://localhost:4566",
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
          ConditionExpression: "attribute_not_exists(messageId)",
          Item: { _: "_", ...record },
          TableName: tableName
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
