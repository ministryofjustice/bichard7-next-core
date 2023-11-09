/*
 *
 * This script
 *    - retrieves audit log events from DynamoDB for the specified date range (start and end arguments)
 *    - filters new UI events
 *    - generates report by event date and username
 *
 * To run this script:
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/usage-report/index.ts {start} {end}
 *
 * e.g.
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/usage-report/index.ts 2023-10-01 2023-11-01
 *
 */

import { Lambda } from "aws-sdk"
import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { isError } from "@moj-bichard7/common/types/Result"
import findEvents from "./fetchEvents"
import generateReportData from "./generateReportData"
import { getDateString } from "./common"
import WorkbookGenerator from "./WorkbookGenerator"

const WORKSPACE = process.env.WORKSPACE ?? "production"
let dynamo: DocumentClient
let eventsTableName: string

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

const run = async () => {
  await setup()
  const start = new Date(process.argv.slice(-2)[0])
  const end = new Date(process.argv.slice(-1)[0])

  const events = await findEvents(dynamo, eventsTableName, start, end)
  if (isError(events)) {
    throw events
  }

  console.log("Generating report data...")
  const reportData = generateReportData(events, start, end)

  console.log("Generating report workbook...")
  const reportFilename = `New UI Report (${getDateString(start)} to ${getDateString(end)}).xlsx`
  new WorkbookGenerator(reportData).generate().saveToFile(reportFilename)
  console.log("Report generated:", reportFilename)
}

run()
