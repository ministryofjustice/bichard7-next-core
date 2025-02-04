import { isError } from "@moj-bichard7/common/types/Result"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { FullAuditLogEvent, getDateString, isNewUIEvent, log, reportEventCodes } from "./common"

const filterEvents = (events: FullAuditLogEvent[]): FullAuditLogEvent[] =>
  events.filter((event) => reportEventCodes.includes(event.eventCode))

const findEvents = async (
  dynamo: DocumentClient,
  eventsTableName: string,
  start: Date,
  end: Date
): Promise<FullAuditLogEvent[] | Error> => {
  log(`Getting messages for the period between ${getDateString(start)} and ${getDateString(end)}`)
  let lastEvaluatedKey
  let events: FullAuditLogEvent[] = []
  const messageIds = new Set<string>()
  console.log(`Fetching messages and events between ${start.toISOString()} and ${end.toISOString()}...`)

  while (true) {
    const query: DocumentClient.QueryInput = {
      TableName: eventsTableName,
      IndexName: "timestampIndex",
      KeyConditionExpression: "#partitionKey = :partitionKeyValue and #rangeKey between :start and :end",
      ExpressionAttributeNames: {
        "#partitionKey": "_",
        "#rangeKey": "timestamp"
      },
      ExpressionAttributeValues: {
        ":start": start.toISOString(),
        ":end": end.toISOString(),
        ":partitionKeyValue": "_"
      },
      Limit: 1000,
      ...(lastEvaluatedKey ? { ExclusiveStartKey: lastEvaluatedKey } : {})
    }

    const eventsResult = await dynamo
      .query(query)
      .promise()
      .catch((error: Error) => error)

    if (isError(eventsResult)) {
      return eventsResult
    }

    if (!eventsResult.Items || eventsResult.Items.length === 0) {
      return events
    }

    lastEvaluatedKey = eventsResult?.LastEvaluatedKey
    let fetchedEvents = (eventsResult.Items ?? []) as FullAuditLogEvent[]
    fetchedEvents = filterEvents(fetchedEvents) as FullAuditLogEvent[]

    fetchedEvents.forEach((event) => messageIds.add(event._messageId))
    events = events.concat(filterEvents(fetchedEvents))
    const newUiEventsCount = events.filter(isNewUIEvent).length

    console.log(
      "Total cases:",
      messageIds.size,
      ", Old UI events:",
      events.length - newUiEventsCount,
      ", new UI events:",
      newUiEventsCount,
      ", Current date:",
      lastEvaluatedKey?.timestamp
    )

    if (!eventsResult?.LastEvaluatedKey) {
      return events
    }
  }
}

export default findEvents
