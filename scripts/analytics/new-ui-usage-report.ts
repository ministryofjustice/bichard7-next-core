/*
 *
 * This script
 *    - retrieves audit log events from DynamoDB for the specified date range (start and end arguments)
 *    - filters new UI events
 *    - generates report by event date and username
 *
 * To run this script:
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/new-ui-usage-report.ts {start} {end}
 *
 * e.g.
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/new-ui-usage-report.ts 2023-10-01 2023-11-01
 *
 */

import { Lambda } from "aws-sdk"
import EventCode from "../../packages/common/types/EventCode"
import { AuditLogEvent } from "../../packages/common/types/AuditLogEvent"
import * as fs from "fs"
import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { isError } from "@moj-bichard7/common/types/Result"

type ReportData = {
  all: Record<EventCode, number>
  byUser: Record<string, Record<EventCode, number>>
  byDate: Record<string, Record<EventCode, number>>
  eventCodes: EventCode[]
}

const WORKSPACE = process.env.WORKSPACE ?? "production"
let dynamo: DocumentClient
let eventsTableName: string

function log(...params: unknown[]) {
  const logContent = [new Date().toISOString(), " - ", ...params]
  console.log(...logContent)
}

const getDateString = (date: string | Date) => (typeof date === "object" ? date.toISOString() : date).split("T")[0]

const getDates = (start: Date, end: Date) => {
  let date = new Date(start)
  const dates: string[] = []
  while (date <= end) {
    dates.push(getDateString(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}

async function setup() {
  const lambda = new Lambda({ region: "eu-west-2" })
  const retryLambda = await lambda.getFunction({ FunctionName: `bichard-7-${WORKSPACE}-retry-message` }).promise()
  if (isError(retryLambda)) {
    throw Error("Couldn't get DynamoDB connection details")
  }

  const dynamoEndpoint = retryLambda.Configuration?.Environment?.Variables?.AWS_URL || ""
  if (!dynamoEndpoint) {
    throw Error("Couldn't get DynamoDB URL")
  }

  eventsTableName = retryLambda.Configuration?.Environment?.Variables?.AUDIT_LOG_EVENTS_TABLE_NAME || ""
  if (!eventsTableName) {
    throw Error("Couldn't get DynamoDB events table name")
  }

  const service = new DynamoDB({
    endpoint: dynamoEndpoint,
    region: "eu-west-2"
  })
  dynamo = new DocumentClient({ service })
}

function filterEvents(events: AuditLogEvent[]) {
  return events.filter((event) => event.eventSource === "Bichard New UI")
}

async function findEvents(start: Date, end: Date) {
  log(`Getting messages for the period between ${getDateString(start)} and ${getDateString(end)}`)
  let lastEvaluatedKey
  let events: AuditLogEvent[] = []
  const messageIds = new Set<string>()
  let totalEventsFetched = 0
  console.log("Fetching messages and events...")

  while (true) {
    const query: DynamoDB.DocumentClient.QueryInput = {
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

    if (eventsResult.Items.length === 0) {
      return events
    }

    lastEvaluatedKey = eventsResult?.LastEvaluatedKey
    const fetchedEvents = eventsResult.Items

    fetchedEvents.forEach((event) => messageIds.add(event._messageId))
    events = events.concat(filterEvents(fetchedEvents))
    totalEventsFetched += fetchedEvents.length
    console.log(
      "Total cases:",
      messageIds.size,
      ", Total events:",
      totalEventsFetched,
      ", Total new UI events:",
      events.length,
      ", Current date:",
      lastEvaluatedKey?.timestamp
    )

    if(!eventsResult?.LastEvaluatedKey) {
      return events
    }
  }
}

const generateReportData = (events: AuditLogEvent[], start: Date, end: Date): ReportData => {
  const eventCodes = new Set<EventCode>()
  const allEvents = events.reduce((acc: Record<string, number>, event) => {
    acc[event.eventCode] = (acc[event.eventCode] || 0) + 1
    eventCodes.add(event.eventCode as EventCode)
    return acc
  }, {})

  const eventsByUser = events.reduce((acc: Record<string, Record<EventCode, number>>, event) => {
    const username = event.user || "Unknown"
    acc[username] = {
      ...(acc[username] ?? {}),
      [event.eventCode]: (acc[username]?.[event.eventCode] || 0) + 1
    }
    return acc
  }, {})

  let eventsByDate = getDates(start, end).reduce((acc: Record<string, Record<EventCode, number>>, date: string) => {
    acc[date] = {} as Record<EventCode, number>
    return acc
  }, {})
  events.forEach((event) => {
    const date = getDateString(event.timestamp)
    eventsByDate[date] = {
      ...(eventsByDate[date] ?? {}),
      [event.eventCode]: (eventsByDate[date]?.[event.eventCode] || 0) + 1
    }
  })

  return {
    all: allEvents,
    byUser: eventsByUser,
    byDate: eventsByDate,
    eventCodes: Array.from(eventCodes) as EventCode[]
  }
}

const convertToCsv = (reportData: ReportData) => {
  const result: Record<string, string> = {}
  const eventCodes = reportData.eventCodes
  const eventTitles = eventCodes.map((code) => code[0].toUpperCase() + code.slice(1).replace(/\.|-/g, " "))

  const byDateHeader = ["Date", ...eventTitles].join(",")
  const byDateFooter = ["Total", ...eventCodes.map((code) => reportData.all[code])]
  const byDate: string[] = [byDateHeader]
  Object.entries(reportData.byDate).forEach(([date, data]) => {
    const lineData = [date, ...eventCodes.map((eventCode) => data[eventCode] || 0)]
    byDate.push(lineData.join(","))
  })
  byDate.push(byDateFooter.join(","))

  const byUserHeader = ["User", ...eventTitles].join(",")
  const byUserFooter = ["Total", ...eventCodes.map((code) => reportData.all[code])]
  const byUser: string[] = [byUserHeader]
  Object.entries(reportData.byUser).forEach(([date, data]) => {
    const lineData = [date, ...eventCodes.map((eventCode) => data[eventCode] || 0)]
    byUser.push(lineData.join(","))
  })
  byUser.push(byUserFooter.join(","))

  result["byDate"] = byDate.join("\n")
  result["byUser"] = byUser.join("\n")

  return result
}

const run = async () => {
  await setup()
  const start = new Date(process.argv.slice(-2)[0])
  const end = new Date(process.argv.slice(-1)[0])

  const events = await findEvents(start, end)
  if (isError(events)) {
    throw events
  }

  const reportData = generateReportData(events, start, end)
  const csvData = convertToCsv(reportData)

  const reportByDateFilename = `New UI Report by Date (${getDateString(start)} to ${getDateString(end)}).csv`
  fs.writeFileSync(reportByDateFilename, csvData.byDate)
  console.log("Report by date generated:", reportByDateFilename)
  const reportByUserFilename = `New UI Report by User (${getDateString(start)} to ${getDateString(end)}).csv`
  fs.writeFileSync(reportByUserFilename, csvData.byUser)
  console.log("Report by user generated:", reportByUserFilename)
}

run()
