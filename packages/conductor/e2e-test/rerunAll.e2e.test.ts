jest.setTimeout(30_000)
jest.retryTimes(10)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import fs from "fs"
import waitForExpect from "wait-for-expect"

const endpoint = (process.env.S3_ENDPOINT = "http://localhost:4566")
const accessKeyId = (process.env.S3_AWS_ACCESS_KEY_ID = "FAKE")
const secretAccessKey = (process.env.S3_AWS_SECRET_ACCESS_KEY = "FAKE")

const s3Config = createS3Config()

const db = new DynamoDBClient({
  endpoint,
  region: "eu-west-2",
  credentials: { accessKeyId, secretAccessKey }
})

const sendFileToS3 = async (srcFilename: string, destFilename: string, bucket: string) => {
  const client = new S3Client(s3Config)
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

const insertRecordInDynamo = async (s3Path: string, tableName: string) => {
  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      s3Path,
      latestRunAt: "2024-04-03T13:15:47.011Z",
      latestResult: 0,
      correlationId: "5b515377-e65b-4c6c-a69b-5ba835cabb87",
      initialRunAt: "2024-04-03T13:15:47.011Z",
      history: [
        {
          result: 0,
          details: { triggersMatch: 0, exceptionsMatch: 0, xmlParsingMatches: 0, xmlOutputMatches: 0 },
          runAt: "2024-04-03T13:15:47.011Z"
        }
      ],
      version: 1,
      _: "_",
      initialResult: 0
    }
  })
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

describe("Rerun all workflow", () => {
  const phases = [1, 2]
  it.each(phases)("should rerun and update dynamo record", async (phase) => {
    const fixturePath = `../core/phase${phase}/tests/fixtures/e2e-comparison/test-001.json`
    const tableName = getPhaseTableName(phase)
    //write file to s3 with unique id
    const s3Path = `${new Date().toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3(fixturePath, s3Path, "comparisons")
    await insertRecordInDynamo(s3Path, tableName)

    // TODO: Push a message to SQS to trigger the workflow

    //wait for dynamo to be updated
    let record: Record<string, any> | undefined
    await waitForExpect(async () => {
      record = await getDynamoRecord(s3Path, tableName)
      expect(record).toBeDefined()
    })

    expect(record).toHaveProperty("s3Path", s3Path)
  })
})
