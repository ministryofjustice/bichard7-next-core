import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { GetCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import fs from "fs"

const sendFileToS3 = async (srcFilename: string, destFilename: string, bucket: string) => {
    const client = new S3Client(createS3Config())
    const Body = await fs.promises.readFile(srcFilename)
    const command = new PutObjectCommand({ Bucket: bucket, Key: destFilename, Body })
    return client.send(command)
  }
  
const getDynamoRecord = async (s3Path: string, tableName: string): Promise<undefined | Record<string, any>> => {
  const getCommand = new GetCommand({ TableName: tableName, Key: { s3Path } })
  const docClient = DynamoDBDocumentClient.from(db)
  const result = await docClient.send(getCommand)
  return result.Item
}

const setDynamoRecordToFailedStatus = async (record: Record<string, unknown>, tableName: string) => {
  const updatedRecord = {
    ...record,
    latestResult: 0
  }

  const putCommand = new PutCommand({ TableName: tableName, Item: updatedRecord })
  const docClient = DynamoDBDocumentClient.from(db)
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

export {getDynamoRecord, setDynamoRecordToFailedStatus, getPhaseTableName, sendFileToS3}
  