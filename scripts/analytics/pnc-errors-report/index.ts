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
 */

import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import { DynamoDB, Lambda } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { getDateString, pncErrorsFilePath } from "./common"
import getPncResponseReceivedEvents from "./getPncResponseReceivedEvents"
import extractPncErrors from "./extractPncErrors"
import analysePncErrors from "./analysePncErrors"

const fs = require("fs")
const WORKSPACE = process.env.WORKSPACE ?? "production"
let dynamo: DocumentClient
let eventsTableName: string

const setup = async () => {
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

const getPncErrors = async () => {
  const startDate = new Date(process.argv.slice(-2)[0])
  const endDate = new Date(process.argv.slice(-1)[0])

  const pncResponseReceivedEvents = await getPncResponseReceivedEvents(dynamo, eventsTableName, startDate, endDate)
  if (isError(pncResponseReceivedEvents)) {
    throw pncResponseReceivedEvents
  }

  const pncErrors = extractPncErrors(pncResponseReceivedEvents)

  fs.writeFileSync(
    pncErrorsFilePath,
    JSON.stringify(
      {
        dateRange: { startDate: getDateString(startDate), endDate: getDateString(endDate) },
        total: {
          responses: pncResponseReceivedEvents.length,
          successes: pncResponseReceivedEvents.length - pncErrors.length,
          errors: pncErrors.length
        },
        pncErrors
      },
      null,
      2
    )
  )
}

const main = async () => {
  await setup()
  await getPncErrors()
  analysePncErrors()
}

main()
