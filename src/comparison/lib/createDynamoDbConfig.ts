import type { DynamoDbConfig } from "../Types"

export default function createDynamoDbConfig(): DynamoDbConfig {
  const { DYNAMO_URL, DYNAMO_REGION, COMPARISON_TABLE_NAME, DYNAMO_AWS_ACCESS_KEY_ID, DYNAMO_AWS_SECRET_ACCESS_KEY } =
    process.env

  if (!DYNAMO_URL) {
    throw Error("DYNAMO_URL environment variable must have value.")
  }

  if (!DYNAMO_REGION) {
    throw Error("DYNAMO_REGION environment variable must have value.")
  }

  if (!COMPARISON_TABLE_NAME) {
    throw new Error("COMPARISON_TABLE_NAME environment variable must have value.")
  }

  const config: DynamoDbConfig = {
    DYNAMO_URL,
    DYNAMO_REGION,
    TABLE_NAME: COMPARISON_TABLE_NAME
  }

  if (DYNAMO_AWS_ACCESS_KEY_ID) {
    config.AWS_ACCESS_KEY_ID = DYNAMO_AWS_ACCESS_KEY_ID
  }

  if (DYNAMO_AWS_SECRET_ACCESS_KEY) {
    config.AWS_SECRET_ACCESS_KEY = DYNAMO_AWS_SECRET_ACCESS_KEY
  }

  return config
}
