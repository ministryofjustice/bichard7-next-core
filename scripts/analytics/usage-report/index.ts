/*
 *
 * This script
 *    - retrieves audit log events from DynamoDB for the specified date range (start and end arguments)
 *    - filters new UI events
 *    - generates report by event date and username
 *
 * To run this script, connect to the VPN and ensure that you can access the Postgres database, then run this command:
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/usage-report/index.ts {start} {end}
 *
 * e.g.
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/usage-report/index.ts 2023-10-01 2023-11-01
 *
 */

import baseConfig from "@moj-bichard7/common/db/baseConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import { DynamoDB, Lambda, RDS } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { DataSource } from "typeorm"
import { getDateString } from "./common"
import findEvents from "./fetchEvents"
import { findUsersWithAccessToNewUi } from "./findUsersWithAccessToNewUi"
import generateReportData from "./generateReportData"
import WorkbookGenerator from "./WorkbookGenerator"

const WORKSPACE = process.env.WORKSPACE ?? "production"
let dynamo: DocumentClient
let postgres: DataSource
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

  const sanitiseMessageLambda = await lambda
    .getFunction({ FunctionName: `bichard-7-${WORKSPACE}-sanitise-message` })
    .promise()
  if (isError(sanitiseMessageLambda)) {
    throw Error("Couldn't get Postgres connection details (failed to get sanitise lambda function)")
  }

  const rds = new RDS({ region: "eu-west-2" })
  const dbInstances = await rds.describeDBClusters().promise()
  if (isError(dbInstances)) {
    throw Error("Couldn't get Postgres connection details (describeDBInstances)")
  }

  const dbHost = dbInstances.DBClusters?.map((clusters) => clusters.ReaderEndpoint).filter((endpoint) =>
    endpoint?.startsWith(`cjse-${WORKSPACE}-bichard-7-aurora-cluster.cluster-ro-`)
  )?.[0]
  process.env.DB_USER = process.env.DB_PASSWORD = process.env.DB_SSL = "true"
  postgres = await new DataSource({
    ...baseConfig,
    host: dbHost || "",
    username: sanitiseMessageLambda.Configuration?.Environment?.Variables?.DB_USER || "",
    password: sanitiseMessageLambda.Configuration?.Environment?.Variables?.DB_PASSWORD || "",
    type: "postgres",
    applicationName: "ui-connection",
    ssl: { rejectUnauthorized: false }
  }).initialize()
}

const run = async () => {
  await setup()
  const start = new Date(process.argv.slice(-2)[0])
  const end = new Date(process.argv.slice(-1)[0])

  console.log("Getting users with access to the new UI from postgres database...")
  const usersWithAccessToNewUi = await findUsersWithAccessToNewUi(postgres)
  if (isError(usersWithAccessToNewUi)) {
    throw usersWithAccessToNewUi
  }

  const events = await findEvents(dynamo, eventsTableName, start, end)
  if (isError(events)) {
    throw events
  }

  console.log("Generating report data...")
  const auditLogTableName = "bichard-7-production-audit-log"
  const reportData = await generateReportData(events, start, end, dynamo, auditLogTableName)

  console.log("Generating report workbook...")
  const reportFilename = `New UI Report (${getDateString(start)} to ${getDateString(end)}).xlsx`
  new WorkbookGenerator(reportData, usersWithAccessToNewUi).generate().saveToFile(reportFilename)
  console.log("Report generated:", reportFilename)
}

run()
