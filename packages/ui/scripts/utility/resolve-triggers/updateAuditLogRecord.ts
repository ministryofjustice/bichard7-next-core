import AuditLog from "../../../../bichard7-next-audit-logging/src/shared-types/src/AuditLog"
import AuditLogEvent from "../../../../bichard7-next-audit-logging/src/shared-types/src/AuditLogEvent"
import { isError } from "../../../src/types/Result"

export default async function updateAuditLogRecord(
  dynamoDbClient: AWS.DynamoDB.DocumentClient,
  auditLog: AuditLog,
  events: AuditLogEvent[],
  valueLookups: Record<string, unknown>[]
) {
  // Store lookup values
  for (const valueLookup of valueLookups) {
    const createValueLookupParam: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: `bichard-7-${process.env.WORKSPACE}-audit-log-lookup`,
      Item: { _: "_", ...valueLookup },
      ConditionExpression: "attribute_not_exists(messageId)"
    }

    const createValueLookupResult = await dynamoDbClient
      .put(createValueLookupParam)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)

    if (isError(createValueLookupResult)) {
      throw createValueLookupResult
    }
  }

  // Update audit log record
  const record = { ...auditLog }
  record.events = [...record.events, ...events]
  record.lastEventType = events.slice(-1)[0].eventType

  const updateAuditLogParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: `bichard-7-${process.env.WORKSPACE}-audit-log`,
    Item: { _: "_", ...record }
  }

  const updateAuditLogResult = await dynamoDbClient
    .put(updateAuditLogParams)
    .promise()
    .then(() => undefined)
    .catch((error) => <Error>error)

  if (isError(updateAuditLogResult)) {
    throw updateAuditLogResult
  }
}
