import type { AttributeDefinition } from "@aws-sdk/client-dynamodb"

import type { SecondaryIndex } from "./SecondaryIndex"

const getTableAttributes = (
  partitionKey: string,
  sortKey: string | undefined,
  secondaryIndexes: SecondaryIndex[]
): AttributeDefinition[] => {
  const attributesInIndexes: AttributeDefinition[] = []

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
      rangeKey &&
      rangeKey !== partitionKey &&
      rangeKey !== sortKey &&
      attributesInIndexes.filter((x) => x.AttributeName === hashKey).length === 0
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
            AttributeType: "S" as const
          }
        ]
      : []),
    {
      AttributeName: "_",
      AttributeType: "S" as const
    },
    ...attributesInIndexes
  ]
}

export default getTableAttributes
