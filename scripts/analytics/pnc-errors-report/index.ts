import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import { DynamoDB, Lambda } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import getPncResponseReceivedEvents from "./getPncResponseReceivedEvents"

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
  const startDateTime = new Date(process.argv.slice(-2)[0])
  const endDateTime = new Date(process.argv.slice(-1)[0])

  const auditLogEvents = await getPncResponseReceivedEvents(dynamo, eventsTableName, startDateTime, endDateTime)
  if (isError(auditLogEvents)) {
    throw auditLogEvents
  }

  const pncErrors = auditLogEvents
    .map(({ timestamp, attributes }) => {
      const pncResponseMessageAttribute = attributes && attributes["PNC Response Message"]
      // Currently ignoring compressed PNC responses
      const hasPncResponseMessage = pncResponseMessageAttribute && typeof pncResponseMessageAttribute === "string"

      let pncErrorMessage: string | null = null

      if (hasPncResponseMessage) {
        const matches = /<TXT>(?<error>.*?)<\/TXT>/g.exec(pncResponseMessageAttribute)

        if (matches && matches.groups) {
          pncErrorMessage = matches.groups["error"].replace(/\s+/g, " ")
        }
      }

      return {
        timestamp,
        phase: attributes && attributes["PNC Request Type"] === "ENQASI" ? 1 : 3,
        pncErrorMessage
      }
    })
    .filter((event) => event.pncErrorMessage)

  console.log(`\nTotal number of PNC errors: ${pncErrors.length}`)

  const fs = require("fs")

  fs.writeFileSync(
    "scripts/analytics/pnc-errors-report/pnc-response-received-audit-logs-events.json",
    JSON.stringify({ pncErrors }, null, 2)
  )
}

async function main() {
  await setup()
  await run()
}

main()
