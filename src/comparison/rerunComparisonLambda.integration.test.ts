jest.setTimeout(10000)
import "tests/helpers/setEnvironmentVariables"
const comparisonBucketName = "comparison-bucket"
process.env.BATCH_SIZE = "10"
process.env.COMPARISON_LAMBDA_NAME = "DummyName"
process.env.COMPARISON_BUCKET_NAME = comparisonBucketName

import fs from "fs"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import createS3Config from "./createS3Config"
import MockS3 from "tests/helpers/MockS3"
import MockDynamo from "tests/helpers/MockDynamo"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import createDynamoDbConfig from "./createDynamoDbConfig"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"
import rerunComparisonLambda from "./rerunComparisonLambda"
import compareLambda from "./compareLambda"
import type { ComparisonLog } from "./Types"
import { isError } from "./Types"
import MockDate from "mockdate"
import InvokeCompareLambda from "./InvokeCompareLambda"

const dynamoDbGatewayConfig = createDynamoDbConfig()
const s3Config = createS3Config()

const uploadFile = async (fileName: string) => {
  const client = new S3Client(s3Config)
  const body = await fs.promises.readFile(fileName)
  const command = new PutObjectCommand({ Bucket: comparisonBucketName, Key: fileName, Body: body.toString() })
  return client.send(command)
}

const createRecord = (result: number, s3Path: string) => ({
  initialResult: result,
  initialRunAt: "2022-07-09T10:12:13.000Z",
  latestResult: result,
  latestRunAt: "2022-07-09T10:12:13.000Z",
  s3Path,
  version: 1,
  history: [
    {
      result: result,
      runAt: "2022-07-09T10:12:13.000Z",
      details: {
        exceptionsMatch: result,
        triggersMatch: result,
        xmlOutputMatches: result,
        xmlParsingMatches: result
      }
    }
  ]
})

describe("Comparison lambda", () => {
  let s3Server: MockS3
  let dynamoServer: MockDynamo
  const mockedDate = new Date()
  const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

  beforeAll(async () => {
    s3Server = new MockS3(comparisonBucketName)
    await s3Server.start()
    dynamoServer = new MockDynamo()
    await dynamoServer.start(8000)
    MockDate.set(mockedDate)
  })

  afterAll(async () => {
    await s3Server.stop()
    await dynamoServer.stop()
    MockDate.reset()
  })

  beforeEach(async () => {
    await s3Server.reset()
    await dynamoServer.setupTable(dynamoDbTableConfig)
  })

  it("should rerun the failed record", async () => {
    const key = "test-data/comparison/passing.json"
    const response = await uploadFile(key)
    expect(response).toBeDefined()
    const records = [createRecord(1, "should/not/rerun"), createRecord(0, key)]
    await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

    jest.spyOn(InvokeCompareLambda.prototype, "call").mockImplementation(async (s3Path) => {
      await compareLambda({
        detail: {
          bucket: { name: comparisonBucketName },
          object: { key: s3Path }
        }
      })

      return undefined
    })
    const s3Path = "test-data/comparison/passing.json"
    const rerunResult = await rerunComparisonLambda().catch((error) => error)
    expect(isError(rerunResult)).toBe(false)

    const record = await dynamoGateway.getOne("s3Path", s3Path)
    const actualLog = (record as { Item: ComparisonLog }).Item
    expect(actualLog).toStrictEqual({
      _: "_",
      s3Path,
      initialResult: 0,
      initialRunAt: "2022-07-09T10:12:13.000Z",
      latestResult: 1,
      latestRunAt: mockedDate.toISOString(),
      version: 2,
      history: [
        {
          result: 0,
          runAt: "2022-07-09T10:12:13.000Z",
          details: {
            exceptionsMatch: 0,
            triggersMatch: 0,
            xmlOutputMatches: 0,
            xmlParsingMatches: 0
          }
        },
        {
          result: 1,
          runAt: mockedDate.toISOString(),
          details: {
            exceptionsMatch: 1,
            triggersMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        }
      ]
    })
  })
})
