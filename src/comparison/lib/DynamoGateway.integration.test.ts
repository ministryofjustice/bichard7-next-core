import MockDynamo from "tests/helpers/MockDynamo"
import "tests/helpers/setEnvironmentVariables"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"
import type { ComparisonLog } from "../types"
import { isError } from "../types"
import createDynamoDbConfig from "./createDynamoDbConfig"
import DynamoGateway from "./DynamoGateway"

const dynamoDbGatewayConfig = createDynamoDbConfig()

const createRecord = (result: number, s3Path: string, runAt = "2022-07-09T10:12:13.000Z"): ComparisonLog => ({
  version: 1,
  initialResult: result,
  initialRunAt: runAt,
  latestResult: result,
  latestRunAt: runAt,
  s3Path,
  history: [
    {
      result: result,
      runAt,
      details: {
        exceptionsMatch: result,
        triggersMatch: result,
        xmlOutputMatches: result,
        xmlParsingMatches: result
      }
    }
  ]
})

describe("DynamoGateway()", () => {
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

  describe("getFailures()", () => {
    it("should only return the failed records", async () => {
      const records = [createRecord(0, "1"), createRecord(1, "2"), createRecord(0, "3"), createRecord(1, "4")]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getFailures(10)

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(2)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.value![1].s3Path).toBe("3")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should use batch size correctly", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z"),
        createRecord(0, "3", "2022-07-09T10:12:13.000Z"),
        createRecord(0, "4", "2022-07-09T10:12:14.000Z"),
        createRecord(0, "5", "2022-07-09T10:12:15.000Z")
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getFailures(2)

      const firstBatch = await result.next()
      const secondBatch = await result.next()
      const thirdBatch = await result.next()

      if (isError(firstBatch.value) || isError(secondBatch.value) || isError(thirdBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(firstBatch.value).toHaveLength(2)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.value![1].s3Path).toBe("2")
      expect(firstBatch.done).toBe(false)

      expect(secondBatch.value).toHaveLength(2)
      expect(secondBatch.value![0].s3Path).toBe("3")
      expect(secondBatch.value![1].s3Path).toBe("4")
      expect(secondBatch.done).toBe(false)

      expect(thirdBatch.value).toHaveLength(1)
      expect(thirdBatch.value![0].s3Path).toBe("5")
      expect(thirdBatch.done).toBe(false)

      const fourthBatch = await result.next()
      expect(fourthBatch.done).toBe(true)
    })

    it("should return empty when there is no failed records", async () => {
      const records = [createRecord(1, "1"), createRecord(1, "2"), createRecord(1, "3"), createRecord(1, "4")]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getFailures(2)

      const firstBatch = await result.next()
      expect(firstBatch.value).toBeUndefined()
      expect(firstBatch.done).toBe(true)
    })
  })
})
