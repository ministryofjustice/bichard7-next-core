type DynamoDbConfig = {
  DYNAMO_URL: string
  DYNAMO_REGION: string
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  PHASE1_TABLE_NAME: string
  PHASE2_TABLE_NAME: string
  PHASE3_TABLE_NAME: string
}

export default DynamoDbConfig
