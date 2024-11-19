import type { DocumentClient } from "aws-sdk/clients/dynamodb"

import { isError } from "@moj-bichard7/common/types/Result"
import MockDate from "mockdate"
import "phase1/tests/helpers/setEnvironmentVariables"

import type { ComparisonLog } from "../types"

import MockDynamo from "../../phase1/tests/helpers/MockDynamo"
import dynamoDbTableConfig from "../../phase1/tests/helpers/testDynamoDbTableConfig"
import createDynamoDbConfig from "./createDynamoDbConfig"
import DynamoGateway from "./DynamoGateway"
import recordResultInDynamo from "./recordResultInDynamo"

const config = createDynamoDbConfig(1)
const dynamoGateway = new DynamoGateway(config)
const comparisonResult = {
  auditLogEventsMatch: true,
  exceptionsMatch: true,
  triggersMatch: true,
  xmlOutputMatches: true,
  xmlParsingMatches: true
}
let dynamoServer: MockDynamo
const mockedDate = new Date()

describe("recordResultInDynamo", () => {
  beforeAll(async () => {
    dynamoServer = new MockDynamo()
    await dynamoServer.start(8000)
  })

  beforeEach(async () => {
    await dynamoServer.setupTable(dynamoDbTableConfig(config.TABLE_NAME))
    MockDate.set(mockedDate)
  })

  afterEach(() => {
    MockDate.reset()
  })

  afterAll(async () => {
    await dynamoServer.stop()
  })

  it("should insert a new record in DynamoDB", async () => {
    const s3Path = "DummyPath"
    const result = await recordResultInDynamo(s3Path, comparisonResult, 1, "correlation-id", dynamoGateway)
    expect(isError(result)).toBe(false)

    const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)
    const record = (getOneResult as DocumentClient.GetItemOutput).Item as ComparisonLog
    expect(record).toStrictEqual({
      _: "_",
      correlationId: "correlation-id",
      history: [
        {
          details: {
            exceptionsMatch: 1,
            triggersMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          },
          result: 1,
          runAt: mockedDate.toISOString()
        }
      ],
      initialResult: 1,
      initialRunAt: mockedDate.toISOString(),
      latestResult: 1,
      latestRunAt: mockedDate.toISOString(),
      s3Path: "DummyPath",
      version: 1
    })
  })

  it("should insert a new record in DynamoDB and read the date from S3 path", async () => {
    MockDate.reset()
    const s3Path = "2022/07/01/20/12/dummy.json"
    const result = await recordResultInDynamo(s3Path, comparisonResult, 1, "correlation-id", dynamoGateway)
    expect(isError(result)).toBe(false)

    const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)
    const record = (getOneResult as DocumentClient.GetItemOutput).Item as ComparisonLog
    const expectedDate = new Date("2022-07-01T20:12").toISOString()
    expect(record.initialRunAt).toBe(expectedDate)
    expect(record.history[0].runAt).toBe(expectedDate)
    expect(record.latestRunAt).not.toBe(expectedDate)
  })

  it("should update the existing record in DynamoDB", async () => {
    const s3Path = "DummyPath"
    const initialDateString = new Date("2022-01-01").toISOString()
    await dynamoGateway.insertOne(
      {
        _: "_",
        history: [
          {
            details: {
              exceptionsMatch: 1,
              triggersMatch: 0,
              xmlOutputMatches: 1,
              xmlParsingMatches: 1
            },
            result: 0,
            runAt: mockedDate.toISOString()
          }
        ],
        initialResult: 0,
        initialRunAt: initialDateString,
        latestResult: 0,
        latestRunAt: mockedDate.toISOString(),
        s3Path: "DummyPath",
        version: 1
      },
      "s3Path"
    )

    const result = await recordResultInDynamo(s3Path, comparisonResult, 1, "correlation-id", dynamoGateway)
    expect(isError(result)).toBe(false)

    const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)
    const record = (getOneResult as DocumentClient.GetItemOutput).Item as ComparisonLog
    expect(record).toStrictEqual({
      _: "_",
      history: [
        {
          details: {
            exceptionsMatch: 1,
            triggersMatch: 0,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          },
          result: 0,
          runAt: mockedDate.toISOString()
        },
        {
          details: {
            exceptionsMatch: 1,
            triggersMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          },
          result: 1,
          runAt: mockedDate.toISOString()
        }
      ],
      initialResult: 0,
      initialRunAt: initialDateString,
      latestResult: 1,
      latestRunAt: mockedDate.toISOString(),
      s3Path: "DummyPath",
      version: 2
    })
  })

  it("should return error when DynamoGateway failes to get the item", async () => {
    const expectedError = new Error("Dummy get error")
    jest.spyOn(dynamoGateway, "getOne").mockResolvedValue(expectedError)
    const result = await recordResultInDynamo("dummy S3 path", comparisonResult, 1, "correlation-id", dynamoGateway)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when DynamoGateway failes to insert an item", async () => {
    const expectedError = new Error("Dummy insert error")
    jest.spyOn(dynamoGateway, "insertOne").mockResolvedValue(expectedError)
    const result = await recordResultInDynamo("dummy S3 path", comparisonResult, 1, "correlation-id", dynamoGateway)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when DynamoGateway failes to update an item", async () => {
    const expectedError = new Error("Dummy update error")
    jest.spyOn(dynamoGateway, "getOne").mockResolvedValue({ Item: { history: [] } })
    jest.spyOn(dynamoGateway, "updateOne").mockResolvedValue(expectedError)
    const result = await recordResultInDynamo("dummy S3 path", comparisonResult, 1, "correlation-id", dynamoGateway)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })
})
