jest.setTimeout(30_000)
jest.retryTimes(10)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb"
import createS3Config from "common/s3/createS3Config"
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

const getDynamoRecord = async (s3Path: string): Promise<undefined | Record<string, any>> => {
  const db = new DynamoDBClient({
    endpoint,
    region: "eu-west-2",
    credentials: { accessKeyId, secretAccessKey }
  })
  const getCommand = new GetCommand({ TableName: "bichard-7-production-comparison-log", Key: { s3Path } })
  const docClient = DynamoDBDocumentClient.from(db)
  const result = await docClient.send(getCommand)
  return result.Item
}

describe("Compare files workflow", () => {
  it("should compare the file and write results to dynamo", async () => {
    //write file to s3 with unique id
    const s3Path = `${new Date().toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3("../core/phase1/tests/fixtures/e2e-comparison/test-001.json", s3Path, "comparisons")

    //wait for dynamo to be updated
    let record: Record<string, any> | undefined
    await waitForExpect(async () => {
      record = await getDynamoRecord(s3Path)
      expect(record).toBeDefined()
    })

    expect(record).toHaveProperty("s3Path", s3Path)
  })
})
