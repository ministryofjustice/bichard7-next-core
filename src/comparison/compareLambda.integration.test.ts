/* eslint-disable jest/no-conditional-expect */
jest.setTimeout(10000)
import "tests/helpers/setEnvironmentVariables"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import lambda from "src/comparison/compareLambda"
import MockS3 from "tests/helpers/MockS3"
import MockDynamo from "tests/helpers/MockDynamo"
import { ZodError } from "zod"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import createS3Config from "./createS3Config"
import { isError } from "src/comparison/Types"
import type { DocumentClient } from "aws-sdk/clients/dynamodb"
import MockDate from "mockdate"
import createDynamoDbConfig from "./createDynamoDbConfig"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"

const bucket = "comparison-bucket"
const s3Config = createS3Config()

const dynamoDbGatewayConfig = createDynamoDbConfig()

const uploadFile = async (fileName: string) => {
  const client = new S3Client(s3Config)
  const body = await fs.promises.readFile(fileName)
  const command = new PutObjectCommand({ Bucket: bucket, Key: fileName, Body: body.toString() })
  return client.send(command)
}

const mockedDate = new Date()

describe("Comparison lambda", () => {
  let s3Server: MockS3
  let dynamoServer: MockDynamo
  const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
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

  it("should return a passing comparison result", async () => {
    const response = await uploadFile("test-data/comparison/passing.json")
    expect(response).toBeDefined()

    const s3Path = "test-data/comparison/passing.json"
    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: s3Path } }
    })
    expect(result).toStrictEqual({
      triggersMatch: true,
      exceptionsMatch: true,
      xmlOutputMatches: true,
      xmlParsingMatches: true
    })

    const record = await dynamoGateway.getOne("s3Path", s3Path)
    expect(isError(record)).toBe(false)

    const actualRecord = record as DocumentClient.GetItemOutput
    expect(actualRecord.Item).toStrictEqual({
      _: "_",
      s3Path,
      initialRunAt: mockedDate.toISOString(),
      initialResult: 1,
      latestRunAt: mockedDate.toISOString(),
      latestResult: 1,
      history: [
        {
          runAt: mockedDate.toISOString(),
          result: 1,
          details: {
            triggersMatch: 1,
            exceptionsMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        }
      ],
      version: 1
    })
  })

  it("should return a failing comparison result", async () => {
    const s3Path = "test-data/comparison/failing.json"
    const response = await uploadFile(s3Path)

    expect(response).toBeDefined()
    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: s3Path } }
    })
    expect(result).toStrictEqual({
      triggersMatch: false,
      exceptionsMatch: true,
      xmlOutputMatches: false,
      xmlParsingMatches: false
    })

    const record = await dynamoGateway.getOne("s3Path", s3Path)
    expect(isError(record)).toBe(false)

    const actualRecord = record as DocumentClient.GetItemOutput
    expect(actualRecord.Item).toStrictEqual({
      _: "_",
      s3Path,
      initialRunAt: mockedDate.toISOString(),
      initialResult: 0,
      latestRunAt: mockedDate.toISOString(),
      latestResult: 0,
      history: [
        {
          runAt: mockedDate.toISOString(),
          result: 0,
          details: {
            triggersMatch: 0,
            exceptionsMatch: 1,
            xmlOutputMatches: 0,
            xmlParsingMatches: 0
          }
        }
      ],
      version: 1
    })
  })

  it("should update the record in DynamoDB when the a record already exist", async () => {
    await uploadFile("test-data/comparison/passing.json")

    const s3Path = "test-data/comparison/passing.json"
    const existingRecordDate = new Date("2021-01-02").toISOString()
    const existingRecord = {
      _: "_",
      s3Path,
      initialRunAt: existingRecordDate,
      initialResult: 0,
      latestRunAt: existingRecordDate,
      latestResult: 0,
      history: [
        {
          runAt: existingRecordDate,
          result: 0,
          details: {
            triggersMatch: 0,
            exceptionsMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        }
      ],
      version: 1
    }

    await dynamoGateway.insertOne(existingRecord, "s3Path")

    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: s3Path } }
    })
    expect(result).toStrictEqual({
      triggersMatch: true,
      exceptionsMatch: true,
      xmlOutputMatches: true,
      xmlParsingMatches: true
    })

    const record = await dynamoGateway.getOne("s3Path", s3Path)
    expect(isError(record)).toBe(false)

    const actualRecord = record as DocumentClient.GetItemOutput
    expect(actualRecord.Item).toStrictEqual({
      _: "_",
      s3Path,
      initialRunAt: existingRecordDate,
      initialResult: 0,
      latestRunAt: mockedDate.toISOString(),
      latestResult: 1,
      history: [
        {
          runAt: existingRecordDate,
          result: 0,
          details: {
            triggersMatch: 0,
            exceptionsMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        },
        {
          runAt: mockedDate.toISOString(),
          result: 1,
          details: {
            triggersMatch: 1,
            exceptionsMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        }
      ],
      version: 2
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

  it("should throw an error when log in dynamo fails to log the record", async () => {
    const expectedError = new Error("dummy error")
    jest.spyOn(DynamoGateway.prototype, "getOne").mockResolvedValue(expectedError)
    const response = await uploadFile("test-data/comparison/passing.json")
    expect(response).toBeDefined()

    const s3Path = "test-data/comparison/passing.json"
    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: s3Path } }
    }).catch((error) => error)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })
})
