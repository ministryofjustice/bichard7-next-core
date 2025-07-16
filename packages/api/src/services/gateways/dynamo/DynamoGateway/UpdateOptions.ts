export default interface UpdateOptions {
  currentVersion: number
  expressionAttributeNames?: Record<string, string>
  keyName: string
  keyValue: unknown
  updateExpression: string
  updateExpressionValues: Record<string, unknown>
}
