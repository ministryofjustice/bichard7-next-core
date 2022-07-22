import * as standingDataPackageInfo from "@moj-bichard7-developers/bichard7-next-data/package.json"
import MockDynamo from "tests/helpers/MockDynamo"
import "tests/helpers/setEnvironmentVariables"
import createDynamoDbConfig from "./createDynamoDbConfig"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import logInDynamoDb from "./logInDynamoDb"
import type { ComparisonLog } from "./Types"
import { isError } from "./Types"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"
import type { DocumentClient } from "aws-sdk/clients/dynamodb"
import MockDate from "mockdate"

const { version: standingDataVersion } = standingDataPackageInfo
const config = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(config)
const comparisonResult = {
  triggersMatch: true,
  exceptionsMatch: true,
  xmlOutputMatches: true,
  xmlParsingMatches: true
}
let dynamoServer: MockDynamo
const mockedDate = new Date()

describe("logInDynamoDb", () => {
  beforeAll(async () => {
    dynamoServer = new MockDynamo()
    await dynamoServer.start(8000)
  })

  beforeEach(async () => {
    await dynamoServer.setupTable(dynamoDbTableConfig)
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
    const result = await logInDynamoDb(s3Path, comparisonResult, dynamoGateway)
    expect(isError(result)).toBe(false)

    const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)
    const record = (getOneResult as DocumentClient.GetItemOutput).Item as ComparisonLog
    expect(record).toStrictEqual({
      _: "_",
      s3Path: "DummyPath",
      initialRunAt: mockedDate.toISOString(),
      initialResult: 1,
      initialStandingDataVersion: standingDataVersion,
      history: [
        {
          runAt: mockedDate.toISOString(),
          result: 1,
          standingDataVersion,
          details: {
            triggersMatch: 1,
            exceptionsMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        }
      ],
      version: 1,
      latestRunAt: mockedDate.toISOString(),
      latestResult: 1
    })
  })

  it("should update the existing record in DynamoDB", async () => {
    const s3Path = "DummyPath"
    const initialDateString = new Date("2022-01-01").toISOString()
    await dynamoGateway.insertOne(
      {
        _: "_",
        s3Path: "DummyPath",
        initialRunAt: initialDateString,
        initialResult: 0,
        initialStandingDataVersion: standingDataVersion,
        history: [
          {
            runAt: mockedDate.toISOString(),
            result: 0,
            standingDataVersion,
            details: {
              triggersMatch: 0,
              exceptionsMatch: 1,
              xmlOutputMatches: 1,
              xmlParsingMatches: 1
            }
          }
        ],
        version: 1,
        latestRunAt: mockedDate.toISOString(),
        latestResult: 0
      },
      "s3Path"
    )

    const result = await logInDynamoDb(s3Path, comparisonResult, dynamoGateway)
    expect(isError(result)).toBe(false)

    const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)
    const record = (getOneResult as DocumentClient.GetItemOutput).Item as ComparisonLog
    expect(record).toStrictEqual({
      _: "_",
      s3Path: "DummyPath",
      initialRunAt: initialDateString,
      initialResult: 0,
      initialStandingDataVersion: standingDataVersion,
      history: [
        {
          runAt: mockedDate.toISOString(),
          result: 0,
          standingDataVersion,
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
          standingDataVersion,
          details: {
            triggersMatch: 1,
            exceptionsMatch: 1,
            xmlOutputMatches: 1,
            xmlParsingMatches: 1
          }
        }
      ],
      version: 2,
      latestRunAt: mockedDate.toISOString(),
      latestResult: 1
    })
  })

  it("should return error when DynamoGateway failes to get the item", async () => {
    const expectedError = new Error("Dummy get error")
    jest.spyOn(dynamoGateway, "getOne").mockResolvedValue(expectedError)
    const result = await logInDynamoDb("dummy S3 path", comparisonResult, dynamoGateway)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when DynamoGateway failes to insert an item", async () => {
    const expectedError = new Error("Dummy insert error")
    jest.spyOn(dynamoGateway, "insertOne").mockResolvedValue(expectedError)
    const result = await logInDynamoDb("dummy S3 path", comparisonResult, dynamoGateway)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when DynamoGateway failes to update an item", async () => {
    const expectedError = new Error("Dummy update error")
    jest.spyOn(dynamoGateway, "getOne").mockResolvedValue({ Item: { history: [] } })
    jest.spyOn(dynamoGateway, "updateOne").mockResolvedValue(expectedError)
    const result = await logInDynamoDb("dummy S3 path", comparisonResult, dynamoGateway)
    jest.resetAllMocks()

    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })
})
