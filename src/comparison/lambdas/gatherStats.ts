import type DynamoDB from "aws-sdk/clients/dynamodb"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

const config: DynamoDB.ClientConfiguration = {
  endpoint: process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com",
  region: process.env.DYNAMO_REGION ?? "eu-west-2"
}
const client = new DocumentClient(config)

type Result = {
  initialResult: number
  initialRunAt: string
}

type Summary = {
  [k: string]: { total: number; passed: number }
}

const getAllResults = async (ExclusiveStartKey?: DynamoDB.DocumentClient.Key): Promise<Result[]> => {
  const data = await client
    .scan({
      TableName: process.env.COMPARISON_TABLE ?? "bichard-7-production-comparison-log",
      ConsistentRead: false,
      ProjectionExpression: "initialResult,initialRunAt",
      ...(ExclusiveStartKey ? { ExclusiveStartKey } : {})
    })
    .promise()
  const items = data.Items as unknown as Result[]

  if (data.LastEvaluatedKey && items) {
    const result = await getAllResults(data.LastEvaluatedKey)
    return items.concat(result)
  } else {
    return items
  }
}

const bucket = (results: Result[]): void => {
  const bucketedResults = results.reduce((acc, result) => {
    const day = result.initialRunAt.split("T")[0]
    if (!acc[day]) {
      acc[day] = { total: 0, passed: 0 }
    }
    acc[day].total += 1
    acc[day].passed += result.initialResult
    return acc
  }, {} as Summary)
  Object.keys(bucketedResults)
    .sort()
    .forEach((day) => {
      console.log(
        `${day} : total: ${bucketedResults[day].total} passing: ${(
          (bucketedResults[day].passed / bucketedResults[day].total) *
          100
        ).toFixed(1)}%`
      )
    })
}

const main = async () => {
  const allResults = await getAllResults()
  const totalResults = allResults.length
  const passing = allResults.filter((res) => res.initialResult)
  console.log(`Total comparisons: ${totalResults}`)
  console.log(`Passing comparisons: ${passing.length}`)
  console.log(`Passing comparisons: ${((passing.length / totalResults) * 100).toFixed(1)}%`)
  bucket(allResults)
}

main()
