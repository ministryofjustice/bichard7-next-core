/* eslint-disable jest/no-conditional-expect */
jest.setTimeout(10000)
import "tests/helpers/setEnvironmentVariables"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import lambda from "src/comparison/lambda"
import MockS3 from "tests/helpers/MockS3"
import MockDynamo from "tests/helpers/MockDynamo"
import { ZodError } from "zod"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import type * as dynamodb from "@aws-sdk/client-dynamodb"
import createS3Config from "./createS3Config"

const bucket = "comparison-bucket"
const s3Config = createS3Config()

const dynamoDbTableConfig: dynamodb.CreateTableCommandInput = {
  TableName: "core-comparison",
  KeySchema: [{ AttributeName: "s3Path", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "s3Path", AttributeType: "S" }],
  BillingMode: "PAY_PER_REQUEST"
}
const dynamoDbGatewayConfig = {
  DYNAMO_URL: "http://localhost:8000",
  DYNAMO_REGION: "test"
}

const uploadFile = async (fileName: string) => {
  const client = new S3Client(s3Config)
  const Body = await fs.promises.readFile(fileName)
  const command = new PutObjectCommand({ Bucket: bucket, Key: fileName, Body })
  return client.send(command)
}

describe("Comparison lambda", () => {
  let s3Server: MockS3
  let dynamoServer: MockDynamo
  const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
    await s3Server.start()
    dynamoServer = new MockDynamo()
    await dynamoServer.start(8000)
  })

  afterAll(async () => {
    await s3Server.stop()
    await dynamoServer.stop()
  })

  beforeEach(async () => {
    await s3Server.reset()
    await dynamoServer.setupTable(dynamoDbTableConfig)
  })

  it("should return a passing comparison result", async () => {
    const response = await uploadFile("test-data/comparison/passing.json")
    expect(response).toBeDefined()

    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: "test-data/comparison/passing.json" } }
    })
    expect(result).toStrictEqual({
      triggersMatch: true,
      exceptionsMatch: true,
      xmlOutputMatches: true,
      xmlParsingMatches: true
    })
  })

  it("should return a failing comparison result", async () => {
    const response = await uploadFile("test-data/comparison/failing.json")
    expect(response).toBeDefined()
    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: "test-data/comparison/failing.json" } }
    })
    expect(result).toStrictEqual({
      triggersMatch: false,
      exceptionsMatch: true,
      xmlOutputMatches: false,
      xmlParsingMatches: false
    })
  })

  it("should throw an error if the event did not match our schema", async () => {
    expect.assertions(2)
    try {
      await lambda({ wrongPath: "dummy" })
    } catch (e: unknown) {
      const error = e as Error
      expect(error).toBeInstanceOf(ZodError)
      expect((error as ZodError).issues[0].code).toBe("invalid_type")
    }
  })

  it("can call the mock dynamo db", async () => {
    await dynamoGateway.insertOne(dynamoDbTableConfig.TableName ?? "", { s3Path: "somePath" }, "s3Path")

    const result = await dynamoGateway.getOne(dynamoDbTableConfig.TableName ?? "", "s3Path", "somePath")
    expect(result).toEqual({
      Item: {
        _: "_",
        s3Path: "somePath"
      }
    })
  })
})
