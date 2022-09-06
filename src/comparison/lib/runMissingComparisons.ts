import { S3 } from "aws-sdk"
import { isError } from "../types/Result"
import DynamoGateway from "./DynamoGateway"
import InvokeCompareLambda from "./InvokeCompareLambda"

const workspace = process.env.WORKSPACE || "production"
const region = "eu-west-2"
const comparisonLambdaName = `bichard-7-${workspace}-comparison`
const comparisonBucketName = `bichard-7-${workspace}-processing-validation`
const dynamoConfig = {
  DYNAMO_URL: "https://dynamodb.eu-west-2.amazonaws.com",
  DYNAMO_REGION: region,
  TABLE_NAME: `bichard-7-${workspace}-comparison-log`
}

enum ProcessResult {
  Errored,
  Processed,
  AlreadyProcessed
}

const processS3Object = async (
  dynamoGateway: DynamoGateway,
  invokeCompareLambda: InvokeCompareLambda,
  s3Path: string
): Promise<ProcessResult> => {
  const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)
  if (isError(getOneResult)) {
    console.error(getOneResult)
    return ProcessResult.Errored
  }

  if (getOneResult?.Item) {
    console.log(`Already processed: ${s3Path}`)
    return ProcessResult.AlreadyProcessed
  }

  console.log(`Processing ${s3Path}`)
  await invokeCompareLambda.call([s3Path])
  return ProcessResult.Processed
}

const getAllKeys = async (s3PathPrefix: string): Promise<string[]> => {
  const s3Client = new S3({ region })
  let keys: string[] = []
  let nextContinuationToken: string | undefined

  while (true) {
    const objectsList = await s3Client
      .listObjectsV2({
        Bucket: comparisonBucketName,
        Prefix: s3PathPrefix,
        ContinuationToken: nextContinuationToken
      })
      .promise()

    keys = keys.concat((objectsList.Contents?.map((c) => c.Key).filter((x) => x) || []) as string[])
    if (!objectsList.NextContinuationToken) {
      break
    }

    nextContinuationToken = objectsList.NextContinuationToken
  }

  return keys
}

const runMissingComparisons = async (s3PathPrefix: string) => {
  const dynamoGateway = new DynamoGateway(dynamoConfig)
  const invokeCompareLambda = new InvokeCompareLambda(comparisonLambdaName, comparisonBucketName)

  console.log(`Listing S3 objects starting with ${s3PathPrefix}...`)
  const keys = await getAllKeys(s3PathPrefix)
  const result = await Promise.all(keys.map((key) => processS3Object(dynamoGateway, invokeCompareLambda, key)))

  console.log()
  console.log("Total S3 objects found:", keys.length)
  console.log("Processed:", result.filter((x) => x === ProcessResult.Processed).length)
  console.log("Already processed:", result.filter((x) => x === ProcessResult.AlreadyProcessed).length)
  console.log("Errored:", result.filter((x) => x === ProcessResult.Errored).length)
}

export default runMissingComparisons
