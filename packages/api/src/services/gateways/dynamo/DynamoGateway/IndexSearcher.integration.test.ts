import { isError } from "@moj-bichard7/common/types/Result"

import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import TestDynamoGateway from "../../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import IndexSearcher from "./IndexSearcher"

interface TestRecord {
  id: string
  someOtherValue: string
  someOtherValue2: string
}

auditLogDynamoConfig.auditLogTableName = "SearcherTesting"

const gateway = new TestDynamoGateway(auditLogDynamoConfig)
const partitionKey = "id"
const indexName = "someOtherValueSecondaryIndex"
const hashKey = "someOtherValue"
const hashKeyValue = "Dummy value"
const rangeKey = "someOtherValue2"

beforeAll(async () => {
  const options = {
    keyName: partitionKey,
    secondaryIndexes: [
      {
        hashKey,
        name: indexName,
        rangeKey
      }
    ],
    skipIfExists: true,
    sortKey: "someOtherValue"
  }

  await gateway.createTable(auditLogDynamoConfig.auditLogTableName, options)

  await gateway.deleteAll(auditLogDynamoConfig.auditLogTableName, "id")

  await Promise.allSettled(
    [...Array(15).keys()].map(async (i: number) => {
      const index = i + 10
      const record = {
        id: `Record ${index}`,
        someOtherValue: hashKeyValue,
        someOtherValue2: `Value ${index}`
      }

      await gateway.insertOne(auditLogDynamoConfig.auditLogTableName, record, "id")
    })
  )
})

it("should return first 5 records when last record is not provided in the pagination", async () => {
  const result = await new IndexSearcher<TestRecord[]>(gateway, auditLogDynamoConfig.auditLogTableName, partitionKey)
    .useIndex(indexName)
    .setIndexKeys(hashKey, hashKeyValue, rangeKey)
    .paginate(5)
    .execute()

  expect(result).toBeDefined()
  const records = result as TestRecord[]
  expect(records).toHaveLength(5)
  expect(records[0].id).toBe("Record 24")
  expect(records[1].id).toBe("Record 23")
  expect(records[2].id).toBe("Record 22")
  expect(records[3].id).toBe("Record 21")
  expect(records[4].id).toBe("Record 20")
})

it("should return last 4 records when last record is provided in the pagination", async () => {
  const lastRecord: TestRecord = {
    id: "Record 14",
    someOtherValue: hashKeyValue,
    someOtherValue2: "Value 14"
  }

  const result = await new IndexSearcher<TestRecord[]>(gateway, auditLogDynamoConfig.auditLogTableName, partitionKey)
    .useIndex(indexName)
    .setIndexKeys(hashKey, hashKeyValue, rangeKey)
    .paginate(10, lastRecord)
    .execute()

  expect(result).toBeDefined()
  const records = result as TestRecord[]
  expect(records).toHaveLength(4)
  expect(records[0].id).toBe("Record 13")
  expect(records[1].id).toBe("Record 12")
  expect(records[2].id).toBe("Record 11")
  expect(records[3].id).toBe("Record 10")
})

it("should return records in ascending order when pagination is set to order ascending", async () => {
  const result = await new IndexSearcher<TestRecord[]>(gateway, auditLogDynamoConfig.auditLogTableName, partitionKey)
    .useIndex(indexName)
    .setIndexKeys(hashKey, hashKeyValue, rangeKey)
    .paginate(3, null, true)
    .execute()

  expect(result).toBeDefined()
  const records = result as TestRecord[]
  expect(records).toHaveLength(3)
  expect(records[0].id).toBe("Record 10")
  expect(records[1].id).toBe("Record 11")
  expect(records[2].id).toBe("Record 12")
})

it("should return error when provided last item for pagination does not contain the partition key", async () => {
  const lastRecord = {
    someOtherValue: hashKeyValue,
    someOtherValue2: "Value 13"
  }

  const result = await new IndexSearcher<TestRecord[]>(gateway, auditLogDynamoConfig.auditLogTableName, partitionKey)
    .useIndex(indexName)
    .setIndexKeys(hashKey, hashKeyValue, rangeKey)
    .paginate(3, lastRecord, true)
    .execute()

  expect(isError(result)).toBe(true)

  const error = <Error>result
  expect(error.message).toBe(`lastItemForPagination does not contain '${partitionKey}' field`)
})

it("should return error when provided last item for pagination does not contain the hash key", async () => {
  const lastRecord = {
    id: "Record 13",
    someOtherValue2: "Value 13"
  }

  const result = await new IndexSearcher<TestRecord[]>(gateway, auditLogDynamoConfig.auditLogTableName, partitionKey)
    .useIndex(indexName)
    .setIndexKeys(hashKey, hashKeyValue, rangeKey)
    .paginate(3, lastRecord, true)
    .execute()

  expect(isError(result)).toBe(true)

  const error = <Error>result
  expect(error.message).toBe(`lastItemForPagination does not contain '${hashKey}' field`)
})

it("should return error when provided last item for pagination does not contain the range key", async () => {
  const lastRecord = {
    id: "Record 13",
    someOtherValue: hashKeyValue
  }

  const result = await new IndexSearcher<TestRecord[]>(gateway, auditLogDynamoConfig.auditLogTableName, partitionKey)
    .useIndex(indexName)
    .setIndexKeys(hashKey, hashKeyValue, rangeKey)
    .paginate(3, lastRecord, true)
    .execute()

  expect(isError(result)).toBe(true)

  const error = <Error>result
  expect(error.message).toBe(`lastItemForPagination does not contain '${rangeKey}' field`)
})
