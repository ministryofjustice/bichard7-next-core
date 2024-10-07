// eslint-disable-next-line import/no-extraneous-dependencies
import fs from "fs"
// eslint-disable-next-line import/no-extraneous-dependencies
import { DynamoDB } from "aws-sdk"
import { DataSource } from "typeorm"
import { isError } from "../../../src/types/Result"
import resolveCaseTriggers from "./resolveCaseTriggers"
import logAction from "./logAction"
import setup from "./setup"

const resolverUsername = process.env.RESOLVER_USERNAME || "System"

if (!process.env.WORKSPACE) {
  throw Error("WORKSPACE environment variable is required")
}

if (!process.env.TRIGGER_NOTE) {
  throw Error("TRIGGER_NOTE environment variable is required")
}

if (!process.env.CASES_TO_RESOLVE_FILE) {
  throw Error("CASES_TO_RESOLVE_FILE environment variable is required")
}

if (!process.env.TRIGGER_CODES) {
  throw Error("TRIGGER_CODES environment variable is required")
}
const triggerCodesToResolve = process.env.TRIGGER_CODES.split(",")
  .map((x) => x.trim())
  .filter((x) => x)

const resolvedTriggersFilename = `${__dirname}/${process.env.WORKSPACE}-processed-court-case-ids.log`
const batchSize = process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE, 10) : 10

const dynamoDbService = new DynamoDB({
  region: "eu-west-2"
})
const dynamoDbClient = new DynamoDB.DocumentClient({
  region: "eu-west-2",
  service: dynamoDbService
})

const getProcessedCourtCaseIds = () =>
  fs.existsSync(resolvedTriggersFilename)
    ? fs
        .readFileSync(resolvedTriggersFilename)
        .toString()
        .split("\n")
        .filter((x) => !!x)
    : []

const addToProcessedCourtCases = (courtCaseId: number) =>
  fs.appendFileSync(resolvedTriggersFilename, courtCaseId + "\n")

async function run() {
  const resolvedCourtCaseIds = getProcessedCourtCaseIds()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const courtCaseIdsToResolve = JSON.parse(fs.readFileSync(process.env.CASES_TO_RESOLVE_FILE!).toString()) as number[]
  const remainingCourtCaseIds = courtCaseIdsToResolve.filter((c) => !resolvedCourtCaseIds.includes(String(c)))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pgDataSource = (await require("../../../src/services/getDataSource").default()) as DataSource

  logAction(null, `Found ${remainingCourtCaseIds.length} court cases to resolve`)

  let counter = 0
  for (const courtCaseId of remainingCourtCaseIds) {
    logAction(courtCaseId, "Invoking resolveCaseTriggers")
    const result = await resolveCaseTriggers(
      pgDataSource,
      dynamoDbClient,
      courtCaseId,
      resolverUsername,
      triggerCodesToResolve
    )

    if (isError(result)) {
      logAction(courtCaseId, "resolveCaseTriggers failed ", result)
      throw result
    }

    logAction(courtCaseId, "Invoked resolveCaseTriggers")
    addToProcessedCourtCases(courtCaseId)

    counter += 1
    console.log(`\n###################################`)
    console.log(`#### ${counter} cases processed.`)
    console.log(`###################################\n`)
    if (batchSize > 0 && counter >= batchSize) {
      break
    }
  }
  await pgDataSource.destroy()
}

async function start() {
  await setup()
  await run()
}

start()
