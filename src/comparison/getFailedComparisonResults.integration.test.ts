import "tests/helpers/setEnvironmentVariables"
import MockDynamo from "tests/helpers/MockDynamo"
import createDynamoDbConfig from "./createDynamoDbConfig"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"
import type { ComparisonLog } from "./Types"
import { isError } from "./Types"
import getFailedComparisonResults from "./getFailedComparisonResults"

const dynamoDbGatewayConfig = createDynamoDbConfig()

const createRecord = (result: number, s3Path: string): ComparisonLog => ({
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
    console.log(await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path"))))

    const result = await getFailedComparisonResults(dynamoGateway)
    expect(isError(result)).toBe(false)

    const actualRecords = result as ComparisonLog[]
    expect(actualRecords).toHaveLength(2)
    expect(actualRecords[0].s3Path).toBe("1")
    expect(actualRecords[1].s3Path).toBe("3")
  })

  // it("should return empty when there is no failed records", () => {})

  // it("should return error when there is an internal error", () => {})
})
