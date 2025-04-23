import { isError } from "@moj-bichard7/common/types/Result"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { FullAuditLogEvent, getDateString, isNewUIEvent, log, reportEventCodes } from "./common"

const generateDates = (start: Date, end: Date): Date[] => {
  const dates: Date[] = []
  let currentDate = new Date(start)
  while (currentDate < end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

const filterEvents = (events: FullAuditLogEvent[]): FullAuditLogEvent[] =>
  events.filter((event) => reportEventCodes.includes(event.eventCode))

const fetchEvents = async (dynamo: DocumentClient, eventsTableName: string, start: Date, end: Date) => {
  let lastEvaluatedKey
  const messageIds = new Set<string>()
  let events: FullAuditLogEvent[] = []

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
    events = events.concat(fetchedEvents)
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

const findEvents = async (
  dynamo: DocumentClient,
  eventsTableName: string,
  start: Date,
  end: Date
): Promise<FullAuditLogEvent[] | Error> => {
  log(`Getting messages for the period between ${getDateString(start)} and ${getDateString(end)}`)
  const allEvents: FullAuditLogEvent[] = []
  console.log(`Fetching messages and events between ${start.toISOString()} and ${end.toISOString()}...`)
  const dates = generateDates(start, end)
  const totalDates = dates.length

  const worker = async () => {
    while (dates.length > 0) {
      const date = dates.shift()
      if (!date) {
        break
      }

      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      const events = await fetchEvents(dynamo, eventsTableName, date, endDate)
      if (isError(events)) {
        throw events
      }

      allEvents.push(...events)
    }
  }

  const reporter = async () => {
    while (dates.length > 0) {
      console.log(`Fetch events for dates ${totalDates - dates.length} of ${totalDates}`)

      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  await Promise.all(
    new Array(10)
      .fill(0)
      .map(() => worker())
      .concat(reporter())
  )

  return allEvents.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
}

export default findEvents
