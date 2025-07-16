import { isError } from "@moj-bichard7/common/types/Result"
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const getForceOwner = async (
  dynamo: DynamoDBDocumentClient,
  auditLogTableName: string,
  messageId: string
): Promise<string | Error> => {
  const command = new GetCommand({
    TableName: auditLogTableName,
    Key: { messageId },
    ProjectionExpression: "forceOwner",
    ConsistentRead: false
  })

  const auditLogResult = await dynamo.send(command).catch((error: Error) => error)

  if (isError(auditLogResult)) {
    return auditLogResult
  }

  return auditLogResult.Item?.forceOwner
}

export default getForceOwner
