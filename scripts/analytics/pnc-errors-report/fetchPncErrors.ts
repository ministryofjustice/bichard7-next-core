import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { getDateString } from "./common"
import { extractPncErrorsFromEvent, PncError } from "./extractPncErrors"

type PncErrorsResult = { pncErrors: PncError[]; totalEvents: number }

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

const fetchPncErrorEvents = async (
  dynamo: DynamoDBClient,
  eventsTableName: string,
  startDate: Date,
  endDate: Date
): Promise<PncErrorsResult | Error> => {
  let lastEvaluatedKey
  let pncErrors: PncError[] = []
  let totalEvents = 0

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
      return { pncErrors, totalEvents }
    }

    totalEvents += eventsResult.Items?.length ?? 0
    lastEvaluatedKey = eventsResult?.LastEvaluatedKey
    const fetchedPncErrors = eventsResult.Items.map((item) =>
      extractPncErrorsFromEvent(unmarshall(item) as AuditLogEvent)
    ).filter(({ pncErrorMessage }) => !!pncErrorMessage)
    pncErrors = pncErrors.concat(fetchedPncErrors)

    console.log(`Fetched events: ${fetchedPncErrors.length} - Current date: ${lastEvaluatedKey?.timestamp?.S}`)

    if (!eventsResult?.LastEvaluatedKey) {
      console.log(`\nTotal number of audit log events: ${pncErrors.length}`)

      return { pncErrors, totalEvents }
    }
  }
}

const fetchPncErrors = async (
  dynamo: DynamoDBClient,
  eventsTableName: string,
  startDate: Date,
  endDate: Date
): Promise<PncErrorsResult | Error> => {
  log(`Getting messages for the period between ${getDateString(startDate)} and ${getDateString(endDate)}`)
  const allPncErrors: PncError[] = []
  let totalEvents = 0
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
      while (true) {
        const eventsResult = await fetchPncErrorEvents(dynamo, eventsTableName, date, endDate)
        if (isError(eventsResult)) {
          if (eventsResult.name === "ThrottlingException") {
            console.log("ThrottlingException - Waiting 5 seconds (", date, ")")
            await new Promise((resolve) => setTimeout(resolve, 5_000))
            continue
          }
          throw eventsResult
        }

        totalEvents += eventsResult.totalEvents
        allPncErrors.push(...eventsResult.pncErrors)
        break
      }
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

  return { pncErrors: allPncErrors.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)), totalEvents }
}

export default fetchPncErrors
