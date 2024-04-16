import type { S3Client } from "@aws-sdk/client-s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { GetCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import fs from "fs"
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb"

const sendFileToS3 = async (s3Client: S3Client, srcFilename: string, destFilename: string, bucket: string) => {
  const Body = await fs.promises.readFile(srcFilename)
  const command = new PutObjectCommand({ Bucket: bucket, Key: destFilename, Body })
  return s3Client.send(command)
}

const getDynamoRecord = async (
  dynamoDbClient: DynamoDBClient,
  s3Path: string,
  tableName: string
): Promise<undefined | Record<string, any>> => {
  const getCommand = new GetCommand({ TableName: tableName, Key: { s3Path } })
  const docClient = DynamoDBDocumentClient.from(dynamoDbClient)
  const result = await docClient.send(getCommand)
  return result.Item
}

const setDynamoRecordToFailedStatus = async (
  dynamoDbClient: DynamoDBClient,
  record: Record<string, unknown>,
  tableName: string
) => {
  const updatedRecord = {
    ...record,
    latestResult: 0
  }

  const putCommand = new PutCommand({ TableName: tableName, Item: updatedRecord })
  const docClient = DynamoDBDocumentClient.from(dynamoDbClient)
  await docClient.send(putCommand)
}

const getPhaseTableName = (phase: number): string => {
  switch (phase) {
    case 1:
      return process.env.PHASE1_COMPARISON_TABLE_NAME ?? "bichard-7-production-comparison-log"
    case 2:
      return process.env.PHASE2_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase2-comparison-log"
    case 3:
      return process.env.PHASE3_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase3-comparison-log"
    default:
      return `No table exists for phase ${phase}`
  }
}

export { getDynamoRecord, setDynamoRecordToFailedStatus, getPhaseTableName, sendFileToS3 }
