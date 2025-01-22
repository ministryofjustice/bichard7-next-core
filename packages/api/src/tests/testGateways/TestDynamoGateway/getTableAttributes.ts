import type DynamoDB from "aws-sdk/clients/dynamodb"

import type { SecondaryIndex } from "./SecondaryIndex"

const getTableAttributes = (
  partitionKey: string,
  sortKey: string | undefined,
  secondaryIndexes: SecondaryIndex[]
): DynamoDB.AttributeDefinitions => {
  const attributesInIndexes: DynamoDB.AttributeDefinition[] = []

  secondaryIndexes.forEach((index) => {
    const { hashKey, rangeKey } = index
    if (
      hashKey !== partitionKey &&
      hashKey !== sortKey &&
      attributesInIndexes.filter((x) => x.AttributeName === hashKey).length === 0
    ) {
      attributesInIndexes.push({
        AttributeName: hashKey,
        AttributeType: "S"
      })
    }

    if (
      !!rangeKey &&
      rangeKey !== partitionKey &&
      rangeKey !== sortKey &&
      attributesInIndexes.filter((x) => x.AttributeName === rangeKey).length === 0
    ) {
      attributesInIndexes.push({
        AttributeName: rangeKey,
        AttributeType: "S"
      })
    }
  })

  return [
    {
      AttributeName: partitionKey,
      AttributeType: "S"
    },
    ...(sortKey
      ? [
          {
            AttributeName: sortKey,
            AttributeType: "S"
          }
        ]
      : []),
    {
      AttributeName: "_",
      AttributeType: "S"
    },
    ...attributesInIndexes
  ]
}

export default getTableAttributes
