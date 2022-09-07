import logger from "src/lib/logging"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
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
  for await (const failedRecordBatch of dynamoGateway.getFailures(parseInt(BATCH_SIZE, 10))) {
    logger.info(`Fetching next ${BATCH_SIZE} records from the comparison table`)

    if (isError(failedRecordBatch)) {
      logger.error("Failed to fetch records from Dynamo")
      throw failedRecordBatch
    }

    const s3Paths = failedRecordBatch.map(({ s3Path }) => s3Path)

    logger.info(`Invoking a lambda to run those ${s3Paths.length} records`)
    const invocationResult = await invokeCompareLambda.call(s3Paths)
    logger.info(invocationResult)
  }
}
