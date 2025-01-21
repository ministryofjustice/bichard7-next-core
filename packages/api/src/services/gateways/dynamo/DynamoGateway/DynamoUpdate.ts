import type { DocumentClient } from "aws-sdk/clients/dynamodb"

type DynamoUpdate = DocumentClient.TransactWriteItem

export default DynamoUpdate
