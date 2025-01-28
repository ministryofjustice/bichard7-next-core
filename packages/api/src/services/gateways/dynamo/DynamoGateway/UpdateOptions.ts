import type {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  UpdateExpression
} from "aws-sdk/clients/dynamodb"

export default interface UpdateOptions {
  currentVersion: number
  expressionAttributeNames?: ExpressionAttributeNameMap | Record<string, string>
  keyName: string
  keyValue: unknown
  updateExpression: UpdateExpression
  updateExpressionValues: ExpressionAttributeValueMap | Record<string, unknown>
}
