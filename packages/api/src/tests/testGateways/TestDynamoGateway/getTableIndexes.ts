import type { GlobalSecondaryIndex, KeySchemaElement } from "@aws-sdk/client-dynamodb"

import type { SecondaryIndex } from "./SecondaryIndex"

const getKeySchema = (hashKey: string, rangeKey?: string): KeySchemaElement[] => {
  const keySchema: KeySchemaElement[] = [
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

const getTableIndexes = (sortKey: string, secondaryIndexes: SecondaryIndex[]): GlobalSecondaryIndex[] => {
  const indexes: GlobalSecondaryIndex[] = secondaryIndexes.map((index) => {
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
