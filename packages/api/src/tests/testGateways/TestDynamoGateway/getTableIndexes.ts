import type DynamoDB from "aws-sdk/clients/dynamodb"

import type { SecondaryIndex } from "./SecondaryIndex"

const getKeySchema = (hashKey: string, rangeKey?: string) => {
  const keySchema = [
    {
      AttributeName: hashKey,
      KeyType: "HASH"
    }
  ]

  if (rangeKey) {
    keySchema.push({
      AttributeName: rangeKey,
      KeyType: "RANGE"
    })
  }

  return keySchema
}

const getTableIndexes = (sortKey: string, secondaryIndexes: SecondaryIndex[]): DynamoDB.GlobalSecondaryIndexList => {
  const indexes = secondaryIndexes.map((index) => {
    const { hashKey, name, rangeKey } = index

    return {
      IndexName: name,
      KeySchema: getKeySchema(hashKey, rangeKey),
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  })

  indexes.push({
    IndexName: `${sortKey}Index`,
    KeySchema: [
      {
        AttributeName: "_",
        KeyType: "HASH"
      },
      {
        AttributeName: sortKey,
        KeyType: "RANGE"
      }
    ],
    Projection: {
      ProjectionType: "ALL"
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  })

  return indexes
}

export default getTableIndexes
