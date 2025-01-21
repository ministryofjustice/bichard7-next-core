import type { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb"

import { isError } from "@moj-bichard7/common/types/Result"

import type TransactionFailedError from "../../../../types/TransactionFailedError"
import type FetchByIndexOptions from "./FetchByIndexOptions"
import type GetManyOptions from "./GetManyOptions"
import type UpdateOptions from "./UpdateOptions"

import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import TestDynamoGateway from "../TestDynamoGateway/TestDynamoGateway"
import DynamoGateway from "./DynamoGateway"

auditLogDynamoConfig.auditLogTableName = "DynamoGatewayTesting"

const testGateway = new TestDynamoGateway(auditLogDynamoConfig)
const gateway = new DynamoGateway(auditLogDynamoConfig)
const sortKey = "someOtherValue"

describe("DynamoGateway", () => {
  beforeAll(async () => {
    const options = {
      keyName: "id",
      secondaryIndexes: [
        {
          hashKey: "someOtherValue",
          name: "someOtherValueSecondaryIndex"
        }
      ],
      skipIfExists: true,
      sortKey: "someOtherValue"
    }

    await testGateway.createTable(auditLogDynamoConfig.auditLogTableName, options)
  })

  beforeEach(async () => {
    await testGateway.deleteAll(auditLogDynamoConfig.auditLogTableName, "id")
  })

  describe("insertOne()", () => {
    it("should return undefined when successful and have inserted one record", async () => {
      const expectedRecord = {
        id: "InsertOneRecord",
        someOtherValue: "SomeOtherValue"
      }

      const result = await gateway.insertOne(auditLogDynamoConfig.auditLogTableName, expectedRecord, "id")

      expect(result).toBeUndefined()

      const actualRecords = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(actualRecords.Count).toBe(1)

      const actualRecord = actualRecords.Items?.[0]
      expect(actualRecord?.id).toBe(expectedRecord.id)
      expect(actualRecord?.someOtherValue).toBe(expectedRecord.someOtherValue)
    })

    it("should return an error when there is a failure and have inserted zero records", async () => {
      const record = {
        id: 1234,
        someOtherValue: "Id should be a number"
      }

      const result = await gateway.insertOne(auditLogDynamoConfig.auditLogTableName, record, "id")

      expect(result).toBeTruthy()
      expect(isError(result)).toBe(true)
      expect((<Error>result).message).toBe("One or more parameter values were invalid: Type mismatch for key")

      const actualRecords = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(actualRecords.Count).toBe(0)
    })
  })

  describe("insertMany()", () => {
    it("should return undefined when successful and have inserted one record", async () => {
      const expectedRecord = {
        id: "InsertManyRecord",
        someOtherValue: "SomeOtherValue"
      }

      const result = await gateway.insertMany(auditLogDynamoConfig.auditLogTableName, [expectedRecord], "id")

      expect(result).toBeUndefined()

      const actualRecords = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(actualRecords.Count).toBe(1)

      const actualRecord = actualRecords.Items?.[0]
      expect(actualRecord?.id).toBe(expectedRecord.id)
      expect(actualRecord?.someOtherValue).toBe(expectedRecord.someOtherValue)
    })

    it("should return an error when one record is malformed", async () => {
      const records: { id: number | string; someOtherValue: string }[] = new Array(10).fill(0).map((_, idx) => {
        return {
          id: `123${idx}`,
          someOtherValue: "Id should be a string"
        }
      })
      records[7].id = 1237

      const result = await gateway.insertMany(auditLogDynamoConfig.auditLogTableName, records, "id")

      expect(result).toBeTruthy()
      expect(isError(result)).toBe(true)
      expect((<Error>result).message).toBe(
        "Transaction cancelled, please refer cancellation reasons for specific reasons [None, None, None, None, None, None, None, ValidationError, None, None]"
      )
      expect((<TransactionFailedError>result).failureReasons).toHaveLength(10)
      expect((<TransactionFailedError>result).failureReasons[7].Code).toBe("ValidationError")
      expect((<TransactionFailedError>result).failureReasons[7].Message).toBe(
        "One or more parameter values were invalid: Type mismatch for key"
      )

      const actualRecords = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(actualRecords.Count).toBe(0)
    })

    it("should return an error when attempting to insert more records than is supported", async () => {
      const records = new Array(101).fill(0).map((_, idx) => {
        return {
          id: `123${idx}`
        }
      })

      const result = await gateway.insertMany(auditLogDynamoConfig.auditLogTableName, records, "id")
      expect(result).toBeTruthy()
      expect(isError(result)).toBe(true)
      expect((<Error>result).message).toBe("Member must have length less than or equal to 100")
    })
  })

  describe("replaceOne()", () => {
    it("should return error when the record does not exist in dynamoDB", async () => {
      const record = {
        id: "InsertOneRecord",
        someOtherValue: "SomeOtherValue",
        version: 1
      }

      const result = await gateway.replaceOne(auditLogDynamoConfig.auditLogTableName, record, "id", 1)

      expect(result).toBeTruthy()
      expect(isError(result)).toBe(true)
      expect((<Error>result).message).toBe("The conditional request failed")
    })

    it("should return undefined when successful and have updated one record", async () => {
      const oldRecord = {
        id: "InsertOneRecord",
        someOtherValue: "OldValue",
        version: 1
      }

      await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, oldRecord, "id")

      const updatedRecord = {
        id: "InsertOneRecord",
        someOtherValue: "NewValue",
        version: 2
      }
      const result = await gateway.replaceOne(auditLogDynamoConfig.auditLogTableName, updatedRecord, "id", 1)

      expect(result).toBeUndefined()

      const actualRecords = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(actualRecords.Count).toBe(1)

      const actualRecord = actualRecords.Items?.[0]
      expect(actualRecord?.id).toBe(updatedRecord.id)
      expect(actualRecord?.someOtherValue).toBe(updatedRecord.someOtherValue)
    })

    it("should return error if the version is different", async () => {
      const oldRecord = {
        id: "InsertOneRecord",
        someOtherValue: "OldValue",
        version: 1
      }

      await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, oldRecord, "id")

      const updatedRecord = {
        id: "InsertOneRecord",
        someOtherValue: "NewValue",
        version: 2
      }
      const result = await gateway.replaceOne(auditLogDynamoConfig.auditLogTableName, updatedRecord, "id", 2)

      expect(result).toBeTruthy()
      expect(isError(result)).toBe(true)
      expect((<Error>result).message).toBe("The conditional request failed")
    })

    it("should return an error when there is a failure and have inserted zero records", async () => {
      const record = {
        id: 1234,
        someOtherValue: "Id should be a number",
        version: 1
      }

      const result = await gateway.replaceOne(auditLogDynamoConfig.auditLogTableName, record, "id", 1)

      expect(result).toBeTruthy()
      expect(isError(result)).toBe(true)
      expect((<Error>result).message).toBe("One or more parameter values were invalid: Type mismatch for key")

      const actualRecords = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(actualRecords.Count).toBe(0)
    })
  })

  describe("getMany()", () => {
    beforeEach(async () => {
      await Promise.allSettled(
        [...Array(3).keys()].map(async (i: number) => {
          const record = {
            id: `Record ${i}`,
            someOtherValue: `Value ${i}`
          }

          await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, record, "id")
        })
      )
    })

    it("should return limited amount of records", async () => {
      const options: GetManyOptions = {
        pagination: { limit: 1 },
        sortKey
      }
      const actualRecords = await gateway.getMany(auditLogDynamoConfig.auditLogTableName, options)
      const results = <DocumentClient.ScanOutput>actualRecords
      expect(results.Count).toBe(1)
    })

    it("should return records ordered by sort key", async () => {
      const options: GetManyOptions = {
        pagination: { limit: 3 },
        sortKey
      }
      const actualRecords = await gateway.getMany(auditLogDynamoConfig.auditLogTableName, options)
      const results = <DocumentClient.ScanOutput>actualRecords
      expect(results.Count).toBe(3)

      const items = results.Items
      expect(items?.[0].someOtherValue).toBe("Value 2")
      expect(items?.[1].someOtherValue).toBe("Value 1")
      expect(items?.[2].someOtherValue).toBe("Value 0")
    })

    it("should return records from the last key provided", async () => {
      const lastItemKey = { id: "Record 1", someOtherValue: "Value 1" }
      const options: GetManyOptions = {
        pagination: {
          lastItemKey,
          limit: 1
        },
        sortKey
      }
      const actualRecords = await gateway.getMany(auditLogDynamoConfig.auditLogTableName, options)
      const results = <DocumentClient.ScanOutput>actualRecords
      expect(results.Count).toBe(1)

      const item = results.Items![0]
      expect(item.id).toBe("Record 0")
      expect(item.someOtherValue).toBe("Value 0")
    })
  })

  describe("fetchByIndex()", () => {
    beforeEach(async () => {
      await Promise.allSettled(
        [...Array(3).keys()].map(async (i: number) => {
          const record = {
            id: `Record ${i}`,
            someOtherValue: `Value ${i}`
          }

          await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, record, "id")
        })
      )
    })

    it("should return one record when key value exists", async () => {
      const options: FetchByIndexOptions = {
        hashKeyName: "someOtherValue",
        hashKeyValue: "Value 1",
        indexName: "someOtherValueSecondaryIndex",
        pagination: { limit: 10 }
      }

      const actualRecords = await gateway.fetchByIndex(auditLogDynamoConfig.auditLogTableName, options)

      expect(isError(actualRecords)).toBe(false)

      const results = <DocumentClient.QueryOutput>actualRecords
      expect(results.Count).toBe(1)

      const item = results.Items![0]
      expect(item.id).toBe("Record 1")
      expect(item.someOtherValue).toBe("Value 1")
    })

    it("should return null when key value does not exist", async () => {
      const options: FetchByIndexOptions = {
        hashKeyName: "someOtherValue",
        hashKeyValue: "Value doesn't exist",
        indexName: "someOtherValueSecondaryIndex",
        pagination: { limit: 10 }
      }

      const actualRecords = await gateway.fetchByIndex(auditLogDynamoConfig.auditLogTableName, options)

      expect(isError(actualRecords)).toBe(false)

      const results = <DocumentClient.QueryOutput>actualRecords
      expect(results.Count).toBe(0)
    })
  })

  describe("getOne()", () => {
    it("should return the item with matching key", async () => {
      const expectedRecord = {
        id: "Record1",
        someOtherValue: "Value 1"
      }

      await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, expectedRecord, "id")

      const result = await gateway.getOne(auditLogDynamoConfig.auditLogTableName, "id", "Record1")

      const { Item: actualRecord } = result as {
        Item: {
          id: string
          someOtherValue: string
        }
      }
      expect(actualRecord).toBeDefined()
      expect(actualRecord?.id).toBe(expectedRecord.id)
      expect(actualRecord?.someOtherValue).toBe(expectedRecord.someOtherValue)
    })

    it("should return null when no item has a matching key", async () => {
      const result = await testGateway.getOne(auditLogDynamoConfig.auditLogTableName, "id", "InvalidKey")

      expect(isError(result)).toBe(false)
      expect(result).toBeNull()
    })
  })

  describe("getRecordVersion()", () => {
    it("should return only record version when key exists", async () => {
      const expectedRecord = {
        id: "Record1",
        someOtherValue: "Value 1",
        version: 1
      }

      await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, expectedRecord, "id")

      const result = await gateway.getRecordVersion(auditLogDynamoConfig.auditLogTableName, "id", "Record1")

      expect(result).toBeDefined()
      expect(isError(result)).toBe(false)

      const itemResult = result as GetItemOutput
      expect(itemResult.Item).toBeDefined()

      const actualRecord = itemResult.Item as { id: string; someOtherValue: string; version: number }
      expect(actualRecord?.id).toBeUndefined()
      expect(actualRecord?.someOtherValue).toBeUndefined()
      expect(actualRecord?.version).toBe(expectedRecord.version)
    })

    it("should return null when no item has a matching key", async () => {
      const result = await gateway.getRecordVersion(auditLogDynamoConfig.auditLogTableName, "id", "InvalidKey")

      expect(isError(result)).toBe(false)
      expect(result).toBeDefined()

      const itemResult = result as GetItemOutput
      expect(itemResult.Item).toBeUndefined()
    })
  })

  describe("updateEntry()", () => {
    beforeEach(async () => {
      await Promise.allSettled(
        [...Array(3).keys()].map(async (i: number) => {
          const record = {
            id: `Record ${i}`,
            someOtherValue: `Value ${i}`,
            version: 0
          }
          await testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, record, "messageId")
        })
      )
    })

    it("should update one entry when key exists", async () => {
      const recordId = "Record 1"
      const expectedValue = "Updated value"
      const options: UpdateOptions = {
        currentVersion: 0,
        expressionAttributeNames: {
          "#attributeName": "someOtherValue"
        },
        keyName: "id",
        keyValue: recordId,
        updateExpression: "set #attributeName = :newValue",
        updateExpressionValues: {
          ":newValue": expectedValue
        }
      }
      const result = await gateway.updateEntry(auditLogDynamoConfig.auditLogTableName, options)

      expect(isError(result)).toBe(false)

      const getManyOptions: GetManyOptions = {
        pagination: { limit: 3 },
        sortKey
      }
      const actualRecords = <DocumentClient.ScanOutput>(
        await testGateway.getMany(auditLogDynamoConfig.auditLogTableName, getManyOptions)
      )
      expect(isError(actualRecords)).toBeFalsy()

      const filteredRecords = actualRecords.Items?.filter((r) => r.id === recordId)
      expect(filteredRecords).toHaveLength(1)
      expect(filteredRecords?.[0].someOtherValue).toBe(expectedValue)
    })

    it("should return error when key does not exist", async () => {
      const recordId = "Invalid record Id"
      const options: UpdateOptions = {
        currentVersion: 0,
        keyName: "id",
        keyValue: recordId,
        updateExpression: "set someOtherValue = :newValue",
        updateExpressionValues: {
          ":newValue": "Some value"
        }
      }
      const result = await gateway.updateEntry(auditLogDynamoConfig.auditLogTableName, options)

      expect(isError(result)).toBe(true)
    })

    it("should return error when current version does not match the value in the database", async () => {
      const recordId = "Record 1"
      const options: UpdateOptions = {
        currentVersion: 1,
        keyName: "id",
        keyValue: recordId,
        updateExpression: "set someOtherValue = :newValue",
        updateExpressionValues: {
          ":newValue": "Some value"
        }
      }
      const result = await gateway.updateEntry(auditLogDynamoConfig.auditLogTableName, options)

      expect(isError(result)).toBe(true)
    })
  })

  describe("deleteMany", () => {
    it("should delete all items when items exist in the table", async () => {
      const ids = ["item-1", "item-2"]
      await Promise.all(
        ids.map((id) => {
          const item = {
            id,
            someOtherValue: "OldValue"
          }
          return testGateway.insertOne(auditLogDynamoConfig.auditLogTableName, item, "id")
        })
      )

      const deleteResult = await gateway.deleteMany(auditLogDynamoConfig.auditLogTableName, "id", ids)

      expect(isError(deleteResult)).toBe(false)

      const getResult = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)

      expect(getResult.Items).toHaveLength(0)
    })

    it("should be successful when items do not exist in the table", async () => {
      const ids = ["item-1", "item-2"]
      const deleteResult = await gateway.deleteMany(auditLogDynamoConfig.auditLogTableName, "id", ids)

      expect(isError(deleteResult)).toBe(false)
    })

    it("should return error when DynamoDB returns an error", async () => {
      const ids = ["item-1", "item-2"]
      const deleteResult = await gateway.deleteMany(auditLogDynamoConfig.auditLogTableName, "invalid field", ids)

      expect(isError(deleteResult)).toBe(true)

      const actualError = deleteResult as Error
      expect(actualError.message).toBe("One of the required keys was not given a value")
    })
  })

  describe("executeTransaction", () => {
    it("should commit all actions in the transaction", async () => {
      const dynamoQueries = [
        {
          Put: {
            ConditionExpression: "attribute_not_exists(#keyName)",
            ExpressionAttributeNames: {
              "#keyName": "id"
            },
            Item: { _: "_", id: "test-1" },
            TableName: auditLogDynamoConfig.auditLogTableName
          }
        },
        {
          Put: {
            ConditionExpression: "attribute_not_exists(#keyName)",
            ExpressionAttributeNames: {
              "#keyName": "id"
            },
            Item: { _: "_", id: "test-2" },
            TableName: auditLogDynamoConfig.auditLogTableName
          }
        }
      ]

      const result = await gateway.executeTransaction(dynamoQueries)

      expect(isError(result)).toBeFalsy()

      const records = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(records.Items).toHaveLength(2)
      expect(records.Items).toStrictEqual([
        { _: "_", id: "test-1" },
        { _: "_", id: "test-2" }
      ])
    })

    it("should roll back when an action fails in the transaction", async () => {
      const dynamoQueries = [
        {
          Put: {
            ConditionExpression: "attribute_not_exists(#keyName)",
            ExpressionAttributeNames: {
              "#keyName": "id"
            },
            Item: { _: "_", id: "test-1" },
            TableName: auditLogDynamoConfig.auditLogTableName
          }
        },
        {
          Put: {
            ConditionExpression: "attribute_exists(#keyName)",
            ExpressionAttributeNames: {
              "#keyName": "id"
            },
            Item: { _: "_", id: "test-2" },
            TableName: auditLogDynamoConfig.auditLogTableName
          }
        }
      ]

      const result = await gateway.executeTransaction(dynamoQueries)

      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toBe(
        "Transaction cancelled, please refer cancellation reasons for specific reasons [None, ConditionalCheckFailed]"
      )

      const records = await testGateway.getAll(auditLogDynamoConfig.auditLogTableName)
      expect(records.Items).toHaveLength(0)
    })
  })
})
