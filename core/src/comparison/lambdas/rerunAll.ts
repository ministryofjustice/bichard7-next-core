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
  const batchSize = parseInt(BATCH_SIZE, 10)
  let total = 0

  for await (const recordBatch of dynamoGateway.getAll(batchSize, false, ["s3Path"])) {
    if (isError(recordBatch)) {
      logger.error("Failed to fetch records from Dynamo")
      throw recordBatch
    }

    const s3Paths = recordBatch.map(({ s3Path }) => s3Path)
    total += s3Paths.length

    const invocationResult = await invokeCompareLambda.call(s3Paths, batchSize)
    if (isError(invocationResult)) {
      console.error(invocationResult)
    }
    logger.info(`Processed ${total} records up to ${recordBatch[recordBatch.length - 1].s3Path}`)
  }
}
