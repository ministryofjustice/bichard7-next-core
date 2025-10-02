/*
 *
 * This script
 *    - retrieves pnc.response-received audit log events from DynamoDB for the specified date range (start and end arguments)
 *    - filters for PNC errors
 *    - calculates the number of PNC error messages we get for each PNC operation
 *    - outputs to JSON files
 *
 * To run this script using the command:
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/pnc-errors-report/index.ts {start} {end}
 *
 * e.g.
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/pnc-errors-report/index.ts 2023-10-01 2023-11-01
 *
 * e.g. To only use the PNC error code to generate the report (excluding the error message)
 * aws-vault exec qsolution-production -- npx ts-node -T ./scripts/analytics/pnc-errors-report/index.ts 2023-10-01 2023-11-01 --only-code
 *
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { Lambda } from "@aws-sdk/client-lambda"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import analysePncErrors from "./analysePncErrors"
import { getDateString } from "./common"
import { PncError } from "./extractPncErrors"
import fetchPncErrors from "./fetchPncErrors"

export type PncErrorsResult = {
  dateRange: { startDate: string; endDate: string }
  total: {
    responses: number
    successes: number
    errors: number
  }
  pncErrors: PncError[]
}

const fs = require("fs")
const WORKSPACE = process.env.WORKSPACE ?? "production"
let dynamo: DynamoDBClient
let eventsTableName: string

const setup = async () => {
  const lambda = new Lambda({ region: "eu-west-2" })
  const retryLambda = await lambda.getFunction({ FunctionName: `bichard-7-${WORKSPACE}-retry-message` })
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

  const service = new DynamoDBClient({
    endpoint: dynamoEndpoint,
    region: "eu-west-2"
  })
  dynamo = DynamoDBDocumentClient.from(service)
}

const getPncErrors = async (): Promise<PncErrorsResult> => {
  const endDateArgIndex = process.argv.slice(-1)[0]?.startsWith("20") ? -1 : -2
  const startDate = new Date(process.argv.slice(endDateArgIndex - 1)[0])
  const endDate = new Date(process.argv.slice(endDateArgIndex)[0])

  const pncErrorsResult = await fetchPncErrors(dynamo, eventsTableName, startDate, endDate)
  if (isError(pncErrorsResult)) {
    throw pncErrorsResult
  }

  return {
    dateRange: { startDate: getDateString(startDate), endDate: getDateString(endDate) },
    total: {
      responses: pncErrorsResult.totalEvents,
      successes: pncErrorsResult.totalEvents - pncErrorsResult.pncErrors.length,
      errors: pncErrorsResult.pncErrors.length
    },
    pncErrors: pncErrorsResult.pncErrors
  }
}

const main = async () => {
  await setup()
  const errors = await getPncErrors()
  analysePncErrors(errors)
}

main()
