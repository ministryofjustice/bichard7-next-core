import type { CreateTableCommandOutput } from "@aws-sdk/client-dynamodb"
import type { ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb"

import { CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb"
import { DeleteCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"

import type { SecondaryIndex } from "./SecondaryIndex"

import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import getTableAttributes from "./getTableAttributes"
import getTableIndexes from "./getTableIndexes"
import Poller from "./Poller"
import PollOptions from "./PollOptions"

const config = auditLogDynamoConfig
interface CreateTableOptions {
  keyName: string
  secondaryIndexes: SecondaryIndex[]
  skipIfExists: boolean
  sortKey?: string
}

type KeyValue = boolean | number | string

export default class TestDynamoGateway extends AuditLogDynamoGateway {
  async clearDynamo(): Promise<void> {
    await this.deleteAll(config.auditLogTableName, this.auditLogTableKey)
    await this.deleteAll(config.eventsTableName, this.eventsTableKey)
  }

  async createTable(tableName: string, options: CreateTableOptions): Promise<CreateTableCommandOutput | undefined> {
    const { keyName, secondaryIndexes, skipIfExists, sortKey } = options

    if (skipIfExists && (await this.tableExists(tableName))) {
      return undefined
    }

    const attributes = getTableAttributes(keyName, sortKey, secondaryIndexes)
    const indexes = sortKey ? getTableIndexes(sortKey, secondaryIndexes) : undefined

    const command = new CreateTableCommand({
      AttributeDefinitions: attributes,
      GlobalSecondaryIndexes: indexes,
      KeySchema: [
        {
          AttributeName: keyName,
          KeyType: "HASH"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: tableName
    })
    const result = await this.client.send(command)
    return result
  }

  async deleteAll(tableName: string, keyName: string, attempts = 5): Promise<void> {
    const items = await this.getAll(tableName) // ← FIXED: actually get the items

    const promises =
      items.Items?.map((item) =>
        this.client.send(
          new DeleteCommand({
            Key: {
              [keyName]: item[keyName]
            },
            TableName: tableName
          })
        )
      ) ?? []

    await Promise.all(promises)

    const remainingItems = await this.getAll(tableName)
    if (remainingItems.Count && remainingItems.Count > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (attempts > 0) {
        await this.deleteAll(tableName, keyName, attempts - 1)
      } else {
        throw new Error("Could not delete items from Dynamo table")
      }
    }
  }

  async getAll(tableName: string): Promise<ScanCommandOutput> {
    const params: ScanCommandInput = {
      TableName: tableName
    }

    const command = new ScanCommand(params)

    return this.client.send(command)
  }

  async getManyById<T>(tableName: string, indexName: string, keyName: string, keyValue: KeyValue): Promise<null | T[]> {
    const result = await this.client.send(
      new QueryCommand({
        ExpressionAttributeNames: {
          "#keyName": keyName
        },
        ExpressionAttributeValues: {
          ":keyValue": keyValue
        },
        IndexName: indexName,
        KeyConditionExpression: "#keyName = :keyValue",
        TableName: tableName
      })
    )

    if (!result.Items || result.Items.length < 1) {
      return null
    }

    return <T[]>result.Items
  }

  pollForMessages(tableName: string, timeout: number): Promise<ScanCommandOutput | undefined> {
    const poller = new Poller(async () => {
      const response = await this.getAll(tableName)

      if (!response || response.Count === 0) {
        return undefined
      }

      return response
    })

    return poller.poll(new PollOptions(timeout))
  }

  async tableExists(tableName: string): Promise<boolean> {
    const tableResult = await this.service.send(new ListTablesCommand({}))
    return !!tableResult.TableNames?.find((name: string) => name === tableName)
  }
}
