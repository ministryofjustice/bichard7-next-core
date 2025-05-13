import { isError } from "@moj-bichard7/common/types/Result"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
// import { DynamoDB } from "@aws-sdk/client-dynamodb";

const getForceOwner = async (dynamo: DocumentClient, auditLogTableName: string, messageId: string): Promise<string | Error> => {
  const query: DocumentClient.GetItemInput = {
    TableName: auditLogTableName,
    Key: {
      messageId
    },
    ProjectionExpression: "forceOwner",
    ConsistentRead: false
  }

  const auditLogResult = await dynamo
    .get(query)
    .promise()
    .catch((error: Error) => error)

  if (isError(auditLogResult)) {
    return auditLogResult
  }

  return auditLogResult.Item?.forceOwner
}

export default getForceOwner
