import MockDynamo from "phase1/tests/helpers/MockDynamo"
import "phase1/tests/helpers/setEnvironmentVariables"
import dynamoDbTableConfig from "phase1/tests/helpers/testDynamoDbTableConfig"
import type { ComparisonLog } from "../types"
import { isError } from "../types"
import DynamoGateway from "./DynamoGateway"
import createDynamoDbConfig from "./createDynamoDbConfig"

const dynamoDbGatewayConfig = createDynamoDbConfig()

const createRecord = (
  result: number,
  s3Path: string,
  runAt = "2022-07-09T10:12:13.000Z",
  skipped = false
): ComparisonLog => ({
  version: 1,
  initialResult: result,
  initialRunAt: runAt,
  latestResult: result,
  latestRunAt: runAt,
  skipped,
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
    await dynamoServer.setupTable(dynamoDbTableConfig(dynamoDbGatewayConfig.PHASE1_TABLE_NAME))
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

    it("should return empty when there are no failed records", async () => {
      const records = [createRecord(1, "1"), createRecord(1, "2"), createRecord(1, "3"), createRecord(1, "4")]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getFailures(2)

      const firstBatch = await result.next()
      expect(firstBatch.value).toStrictEqual([])
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should not return skipped records by default", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z", true)
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getFailures(10)

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(1)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should return skipped records if specified", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z", true)
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getFailures(10, true)

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(2)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.value![1].s3Path).toBe("2")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })
  })

  describe("getRange()", () => {
    it("should only return records within the specified range", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:01:00.000Z"),
        createRecord(0, "2", "2022-07-09T11:01:00.000Z"),
        createRecord(0, "3", "2022-07-09T12:01:00.000Z"),
        createRecord(0, "4", "2022-07-09T13:01:00.000Z"),
        createRecord(0, "5", "2022-07-09T14:01:00.000Z")
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getRange("2022-07-09T11:00:00.000Z", "2022-07-09T14:00:00.000Z")

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(3)
      expect(firstBatch.value![0].s3Path).toBe("2")
      expect(firstBatch.value![1].s3Path).toBe("3")
      expect(firstBatch.value![2].s3Path).toBe("4")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should filter records within the range if a filter is specified", async () => {
      const records = [
        createRecord(1, "1", "2022-07-09T10:01:00.000Z"),
        createRecord(0, "2", "2022-07-09T11:02:00.000Z"),
        createRecord(1, "3", "2022-07-09T12:03:00.000Z"),
        createRecord(0, "4", "2022-07-09T13:04:00.000Z"),
        createRecord(1, "5", "2022-07-09T14:05:00.000Z")
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const failedResult = await dynamoGateway.getRange("2022-07-09T11:00:00.000Z", "2022-07-09T14:00:00.000Z", false)

      const failedFirstBatch = await failedResult.next()
      if (isError(failedFirstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(failedFirstBatch.value)).toBe(false)
      expect(failedFirstBatch.value).toHaveLength(2)
      expect(failedFirstBatch.value![0].s3Path).toBe("2")
      expect(failedFirstBatch.value![1].s3Path).toBe("4")
      expect(failedFirstBatch.done).toBe(false)

      const failedSecondBatch = await failedResult.next()
      expect(failedSecondBatch.done).toBe(true)

      const passedResult = await dynamoGateway.getRange("2022-07-09T11:00:00.000Z", "2022-07-09T14:00:00.000Z", true)

      const passedFirstBatch = await passedResult.next()
      if (isError(passedFirstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(passedFirstBatch.value)).toBe(false)
      expect(passedFirstBatch.value).toHaveLength(1)
      expect(passedFirstBatch.value![0].s3Path).toBe("3")
      expect(passedFirstBatch.done).toBe(false)

      const passedSecondBatch = await passedResult.next()
      expect(passedSecondBatch.done).toBe(true)
    })

    it("should use batch size correctly", async () => {
      const records = [
        createRecord(1, "1", "2022-07-09T10:01:00.000Z"),
        createRecord(0, "2", "2022-07-09T11:01:00.000Z"),
        createRecord(1, "3", "2022-07-09T12:01:00.000Z"),
        createRecord(0, "4", "2022-07-09T13:01:00.000Z"),
        createRecord(1, "5", "2022-07-09T14:01:00.000Z")
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getRange("2022-07-09T10:00:00.000Z", "2022-07-09T15:00:00.000Z", undefined, 2)

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

    it("should return empty when there are no records in range", async () => {
      const records = [createRecord(1, "1"), createRecord(1, "2"), createRecord(1, "3"), createRecord(1, "4")]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getRange("2022-07-09T17:00:00.000Z", "2022-07-09T17:01:00.000Z")

      const firstBatch = await result.next()
      expect(firstBatch.value).toStrictEqual([])
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should not return skipped records by default", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z", true)
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getRange("2022-07-09T10:00:00.000Z", "2022-07-09T15:00:00.000Z")

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(1)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should return skipped records if specified", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z", true)
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getRange(
        "2022-07-09T10:00:00.000Z",
        "2022-07-09T15:00:00.000Z",
        undefined,
        10,
        true
      )

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(2)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.value![1].s3Path).toBe("2")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })
  })

  describe("getAll()", () => {
    it("should return all records", async () => {
      const records = [
        createRecord(1, "1", "2022-07-09T10:01:00.000Z"),
        createRecord(0, "2", "2022-07-09T11:01:00.000Z"),
        createRecord(1, "3", "2022-07-09T12:01:00.000Z"),
        createRecord(0, "4", "2022-07-09T13:01:00.000Z")
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getAll()

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(4)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.value![1].s3Path).toBe("2")
      expect(firstBatch.value![2].s3Path).toBe("3")
      expect(firstBatch.value![3].s3Path).toBe("4")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should use batch size correctly", async () => {
      const records = [
        createRecord(1, "1", "2022-07-09T10:01:00.000Z"),
        createRecord(0, "2", "2022-07-09T11:01:00.000Z"),
        createRecord(1, "3", "2022-07-09T12:01:00.000Z"),
        createRecord(0, "4", "2022-07-09T13:01:00.000Z"),
        createRecord(1, "5", "2022-07-09T14:01:00.000Z")
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getAll(2)

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

    it("should not return skipped records by default", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z", true)
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getAll()

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(1)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })

    it("should return skipped records if specified", async () => {
      const records = [
        createRecord(0, "1", "2022-07-09T10:12:11.000Z"),
        createRecord(0, "2", "2022-07-09T10:12:12.000Z", true)
      ]
      await Promise.all(records.map((record) => dynamoGateway.insertOne(record, "s3Path")))

      const result = await dynamoGateway.getAll(10, true)

      const firstBatch = await result.next()
      if (isError(firstBatch.value)) {
        throw new Error("Error returned from Dynamo")
      }

      expect(isError(firstBatch.value)).toBe(false)
      expect(firstBatch.value).toHaveLength(2)
      expect(firstBatch.value![0].s3Path).toBe("1")
      expect(firstBatch.value![1].s3Path).toBe("2")
      expect(firstBatch.done).toBe(false)

      const secondBatch = await result.next()
      expect(secondBatch.done).toBe(true)
    })
  })
})
