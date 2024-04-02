jest.setTimeout(30_000)
jest.retryTimes(10)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import fs from "fs"
import waitForExpect from "wait-for-expect"

const endpoint = (process.env.S3_ENDPOINT = "http://localhost:4566")
const accessKeyId = (process.env.S3_AWS_ACCESS_KEY_ID = "FAKE")
const secretAccessKey = (process.env.S3_AWS_SECRET_ACCESS_KEY = "FAKE")

const s3Config = createS3Config()

const sendFileToS3 = async (srcFilename: string, destFilename: string, bucket: string) => {
  const client = new S3Client(s3Config)
  const Body = await fs.promises.readFile(srcFilename)
  const command = new PutObjectCommand({ Bucket: bucket, Key: destFilename, Body })
  return client.send(command)
}

const getDynamoRecord = async (s3Path: string, tableName: string): Promise<undefined | Record<string, any>> => {
  const db = new DynamoDBClient({
    endpoint,
    region: "eu-west-2",
    credentials: { accessKeyId, secretAccessKey }
  })
  const getCommand = new GetCommand({ TableName: tableName, Key: { s3Path } })
  const docClient = DynamoDBDocumentClient.from(db)
  const result = await docClient.send(getCommand)
  return result.Item
}

const getPhaseTableName = (phase: number) : string => {
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

describe("Compare files workflow", () => {
  const phases = [1,2]
  it.each(phases)("should compare the file and write results to dynamo", async (phase) => {
    const fixturePath = `../core/phase${phase}/tests/fixtures/e2e-comparison/test-001.json`
    let tableName = getPhaseTableName(phase)
    //write file to s3 with unique id
    const s3Path = `${new Date().toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3(fixturePath, s3Path, "comparisons")

    //wait for dynamo to be updated
    let record: Record<string, any> | undefined
    await waitForExpect(async () => {
      record = await getDynamoRecord(s3Path, tableName)
      expect(record).toBeDefined()
    })

    expect(record).toHaveProperty("s3Path", s3Path)
  })
})
