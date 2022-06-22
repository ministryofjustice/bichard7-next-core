import type { DynamoDbConfig } from "src/comparison/Types"

export default function createDynamoDbConfig(): DynamoDbConfig {
  const { DYNAMO_URL, DYNAMO_REGION, TABLE_NAME, DYNAMO_AWS_ACCESS_KEY_ID, DYNAMO_AWS_SECRET_ACCESS_KEY } = process.env

  if (!DYNAMO_URL) {
    throw Error("AWS_URL environment variable must have value.")
  }

  if (!DYNAMO_REGION) {
    throw Error("AWS_REGION environment variable must have value.")
  }

  if (!TABLE_NAME) {
    throw Error("TABLE_NAME environment variable must have value.")
  }

  const config: DynamoDbConfig = {
    DYNAMO_URL,
    DYNAMO_REGION
  }

  if (DYNAMO_AWS_ACCESS_KEY_ID) {
    config.AWS_ACCESS_KEY_ID = DYNAMO_AWS_ACCESS_KEY_ID
  }

  if (DYNAMO_AWS_SECRET_ACCESS_KEY) {
    config.AWS_SECRET_ACCESS_KEY = DYNAMO_AWS_SECRET_ACCESS_KEY
  }

  return config
}
