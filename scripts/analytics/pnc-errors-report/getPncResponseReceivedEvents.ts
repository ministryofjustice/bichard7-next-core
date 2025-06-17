import { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { getDateString } from "./common"
import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

const log = (...params: unknown[]) => {
  const logContent = [new Date().toISOString(), " - ", ...params]
  console.log(...logContent)
}

const generateDates = (start: Date, end: Date): Date[] => {
  const dates: Date[] = []
  let currentDate = new Date(start)
  while (currentDate < end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

const fetchEvents = async (dynamo: DynamoDBClient, eventsTableName: string, startDate: Date, endDate: Date) => {
  let lastEvaluatedKey
  let events: AuditLogEvent[] = []

  while (true) {
    const query: QueryCommandInput = {
      TableName: eventsTableName,
      IndexName: "eventCodeIndex",
      KeyConditionExpression: "#partitionKey = :partitionKeyValue and #rangeKey between :start and :end",
      ExpressionAttributeNames: {
        "#partitionKey": "eventCode",
        "#rangeKey": "timestamp"
      },
      ExpressionAttributeValues: {
        ":start": { S: startDate.toISOString() },
        ":end": { S: endDate.toISOString() },
        ":partitionKeyValue": { S: EventCode.PncResponseReceived }
      },
      Limit: 1000,
      ...(lastEvaluatedKey ? { ExclusiveStartKey: lastEvaluatedKey } : {})
    }

    const eventsResult = await dynamo.send(new QueryCommand(query)).catch((error: Error) => error)

    if (isError(eventsResult)) {
      return eventsResult
    }

    if (!eventsResult.Items || eventsResult.Items.length === 0) {
      return events
    }

    lastEvaluatedKey = eventsResult?.LastEvaluatedKey
    const fetchedEvents = eventsResult.Items.map((item) => unmarshall(item)) as AuditLogEvent[]
    events = events.concat(fetchedEvents)

    console.log(`Fetched events: ${fetchedEvents.length} - Current date: ${lastEvaluatedKey?.timestamp?.S}`)

    if (!eventsResult?.LastEvaluatedKey) {
      console.log(`\nTotal number of audit log events: ${events.length}`)

      return events
    }
  }
}

const getPncResponseReceivedEvents = async (
  dynamo: DynamoDBClient,
  eventsTableName: string,
  startDate: Date,
  endDate: Date
): Promise<AuditLogEvent[] | Error> => {
  log(`Getting messages for the period between ${getDateString(startDate)} and ${getDateString(endDate)}`)
  const allEvents: AuditLogEvent[] = []
  console.log(`Fetching messages and events between ${startDate.toISOString()} and ${endDate.toISOString()}...`)
  const dates = generateDates(startDate, endDate)
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

export default getPncResponseReceivedEvents
