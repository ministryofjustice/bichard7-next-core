import logger from "src/lib/logging"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import getFailedComparisonResults from "../lib/getFailedComparisonResults"
import InvokeCompareLambda from "../lib/InvokeCompareLambda"
import { isError } from "../types"

const { BATCH_SIZE, COMPARISON_LAMBDA_NAME, COMPARISON_BUCKET_NAME } = process.env
if (!BATCH_SIZE) {
  throw Error("BATCH_SIZE environment variable is required")
}

if (!COMPARISON_LAMBDA_NAME) {
  throw Error("COMPARISON_LAMBDA_NAME environment variable is required")
}

if (!COMPARISON_BUCKET_NAME) {
  throw Error("COMPARISON_BUCKET_NAME environment variable is required")
}

const dynamoConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoConfig)
const invokeCompareLambda = new InvokeCompareLambda(COMPARISON_LAMBDA_NAME, COMPARISON_BUCKET_NAME)

export default async () => {
  logger.info(`Fetching ${BATCH_SIZE} records from the comparison table.`)
  const failedRecords = await getFailedComparisonResults(dynamoGateway, parseInt(BATCH_SIZE, 10))
  if (isError(failedRecords)) {
    throw failedRecords
  }

  logger.info(`Invoking compare lambda for ${failedRecords.length} records`)
  const failedS3Paths = failedRecords.map(({ s3Path }) => s3Path)
  const invocationResult = await invokeCompareLambda.call(failedS3Paths)
  logger.info(invocationResult)
}
