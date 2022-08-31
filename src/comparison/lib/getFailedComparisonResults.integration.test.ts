import MockDynamo from "tests/helpers/MockDynamo"
import "tests/helpers/setEnvironmentVariables"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"
import DynamoGateway from "../DynamoGateway/DynamoGateway"
import type { ComparisonLog } from "../types"
import { isError } from "../types"
import createDynamoDbConfig from "./createDynamoDbConfig"
import getFailedComparisonResults from "./getFailedComparisonResults"

const dynamoDbGatewayConfig = createDynamoDbConfig()

const createRecord = (result: number, s3Path: string): ComparisonLog => ({
  version: 1,
  initialResult: result,
  initialRunAt: "2022-07-09T10:12:13.000Z",
  latestResult: result,
  latestRunAt: "2022-07-09T10:12:13.000Z",
  s3Path,
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

describe("getFailedComparisonResults", () => {
  let dynamoServer: MockDynamo
  const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

  beforeAll(async () => {
    dynamoServer = new MockDynamo()
    await dynamoServer.start(8000)
  })

  afterAll(async () => {
    await dynamoServer.stop()
  })

  beforeEach(async () => {
    await dynamoServer.setupTable(dynamoDbTableConfig)
  })

  it("should only return the failed records", async () => {
    const records = [createRecord(0, "1"), createRecord(1, "2"), createRecord(0, "3"), createRecord(1, "4")]
    await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

    const result = await getFailedComparisonResults(dynamoGateway, 10)
    expect(isError(result)).toBe(false)

    const actualRecords = result as ComparisonLog[]
    expect(actualRecords).toHaveLength(2)
    expect(actualRecords[0].s3Path).toBe("1")
    expect(actualRecords[1].s3Path).toBe("3")
  })

  it("should only return the two out of 5 failed records", async () => {
    const records = [
      createRecord(0, "1"),
      createRecord(0, "2"),
      createRecord(0, "3"),
      createRecord(0, "4"),
      createRecord(0, "5")
    ]
    await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

    const result = await getFailedComparisonResults(dynamoGateway, 2)
    expect(isError(result)).toBe(false)

    const actualRecords = result as ComparisonLog[]
    expect(actualRecords).toHaveLength(2)
    expect(actualRecords[0].s3Path).toBe("2")
    expect(actualRecords[1].s3Path).toBe("1")
  })

  it("should return empty when there is no failed records", async () => {
    const records = [createRecord(1, "1"), createRecord(1, "2"), createRecord(1, "3"), createRecord(1, "4")]
    await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

    const result = await getFailedComparisonResults(dynamoGateway, 10)
    expect(isError(result)).toBe(false)

    const actualRecords = result as ComparisonLog[]
    expect(actualRecords).toHaveLength(0)
  })

  it("should return error when there is an internal error", async () => {
    const error = new Error("Dummy error message")
    jest.spyOn(dynamoGateway, "getFailedOnes").mockResolvedValue(error)

    const result = await getFailedComparisonResults(dynamoGateway, 10)
    expect(isError(result)).toBe(true)
    const actualError = result as Error
    expect(actualError.message).toBe(error.message)
  })
})
