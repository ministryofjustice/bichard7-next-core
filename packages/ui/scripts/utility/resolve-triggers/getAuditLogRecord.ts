import { isError } from "../../../src/types/Result"
import logAction from "./logAction"
import AuditLog from "../../../../bichard7-next-audit-logging/src/shared-types/src/AuditLog"

export async function getAuditLogRecord(
  dynamoDbClient: AWS.DynamoDB.DocumentClient,
  messageId: string,
  courtCaseId: number
) {
  const result = await dynamoDbClient
    .get({
      TableName: `bichard-7-${process.env.WORKSPACE}-audit-log`,
      Key: {
        messageId
      }
    })
    .promise()
    .catch((error: Error) => error)

  if (isError(result)) {
    throw result
  } else if (!result.Item) {
    logAction(courtCaseId, "Audit log record not found. Creating a new audit log record")
    return {
      ...new AuditLog(messageId, new Date("1970-01-01T00:00:00.000Z"), messageId),
      messageId,
      caseId: "Unknown",
      createdBy: "CustomScript_TriggerResolver",
      nextSanitiseCheck: new Date().toISOString()
    }
  }

  return result.Item as AuditLog
}
