import type { DynamoDbConfig } from "../types"

export default function createDynamoDbConfig(): DynamoDbConfig {
  const {
    DYNAMO_URL,
    DYNAMO_REGION,
    PHASE1_COMPARISON_TABLE_NAME,
    PHASE2_COMPARISON_TABLE_NAME,
    PHASE3_COMPARISON_TABLE_NAME,
    DYNAMO_AWS_ACCESS_KEY_ID,
    DYNAMO_AWS_SECRET_ACCESS_KEY
  } = process.env

  if (!DYNAMO_URL) {
    throw Error("DYNAMO_URL environment variable must have value.")
  }

  if (!PHASE1_COMPARISON_TABLE_NAME) {
    throw new Error("PHASE1_COMPARISON_TABLE_NAME environment variable must have value.")
  }

  if (!PHASE2_COMPARISON_TABLE_NAME) {
    throw new Error("PHASE2_COMPARISON_TABLE_NAME environment variable must have value.")
  }

  if (!PHASE3_COMPARISON_TABLE_NAME) {
    throw new Error("PHASE3_COMPARISON_TABLE_NAME environment variable must have value.")
  }

  const config: DynamoDbConfig = {
    DYNAMO_URL,
    DYNAMO_REGION: DYNAMO_REGION ?? "eu-west-2",
    PHASE1_TABLE_NAME: PHASE1_COMPARISON_TABLE_NAME,
    PHASE2_TABLE_NAME: PHASE2_COMPARISON_TABLE_NAME,
    PHASE3_TABLE_NAME: PHASE3_COMPARISON_TABLE_NAME
  }

  if (DYNAMO_AWS_ACCESS_KEY_ID) {
    config.AWS_ACCESS_KEY_ID = DYNAMO_AWS_ACCESS_KEY_ID
  }

  if (DYNAMO_AWS_SECRET_ACCESS_KEY) {
    config.AWS_SECRET_ACCESS_KEY = DYNAMO_AWS_SECRET_ACCESS_KEY
  }

  return config
}
