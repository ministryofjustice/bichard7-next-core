import type DynamoDB from "aws-sdk/clients/dynamodb"

export default interface Pagination {
  lastItemKey?: DynamoDB.DocumentClient.Key
  limit?: number
}
