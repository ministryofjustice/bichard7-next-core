jest.setTimeout(30_000)
jest.retryTimes(10)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import waitForExpect from "wait-for-expect"
import { getPhaseTableName, sendFileToS3, getDynamoRecord } from "./helpers/e2eHelpers"

const endpoint = (process.env.S3_ENDPOINT = "http://localhost:4566")
const accessKeyId = (process.env.S3_AWS_ACCESS_KEY_ID = "FAKE")
const secretAccessKey = (process.env.S3_AWS_SECRET_ACCESS_KEY = "FAKE")

const s3Client = new S3Client(createS3Config())

const dbClient = new DynamoDBClient({
  endpoint,
  region: "eu-west-2",
  credentials: { accessKeyId, secretAccessKey }
})

const sqsClient = new SQSClient({
  endpoint,
  region: "eu-west-2",
  credentials: { accessKeyId, secretAccessKey }
})

describe("Rerun all workflow", () => {
  it("should rerun phase 2 comparisons and update dynamo record", async () => {
    const phase = 2
    const fixturePath = `../core/phase${phase}/tests/fixtures/e2e-comparison/test-001.json`
    const tableName = getPhaseTableName(phase)
    //write file to s3 with unique id
    const s3Path = `${new Date().toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3(s3Client, fixturePath, s3Path, "comparisons")

    //wait for dynamo to be updated
    let originalRecord: Record<string, any> | undefined
    await waitForExpect(async () => {
      originalRecord = await getDynamoRecord(dbClient, s3Path, tableName)
      expect(originalRecord?.["history"]).toHaveLength(1)
      expect(originalRecord).toBeDefined()
    })

    expect(originalRecord).toHaveProperty("s3Path", s3Path)

    const startDate = new Date()
    startDate.setHours(startDate.getHours() - 1)

    const command = new SendMessageCommand({
      QueueUrl: "rerunAll",
      DelaySeconds: 3,
      MessageBody: JSON.stringify({ startDate: startDate.toISOString() })
    })

    await sqsClient.send(command)

    await waitForExpect(
      async () => {
        const updatedRecord = await getDynamoRecord(dbClient, s3Path, tableName)
        expect(updatedRecord).toBeDefined()
        expect(updatedRecord?.["history"]).toHaveLength(2)
        expect(originalRecord?.["latestRunAt"]).not.toBe(updatedRecord?.latestRunAt)
      },
      60_000,
      5_000
    )
  })
})
