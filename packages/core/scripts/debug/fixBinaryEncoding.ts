import type { PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { isError } from "@moj-bichard7/common/types/Result"
import type { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

const s3Config = createS3Config()
const config: DynamoDB.ClientConfiguration = {
  endpoint: process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com",
  region: process.env.DYNAMO_REGION ?? "eu-west-2"
}
const client = new DocumentClient(config)

const writeFileToS3 = (path: string, bucket: string, contents: string): Promise<PutObjectCommandOutput | Error> => {
  const s3Client = new S3Client(s3Config)
  const command = new PutObjectCommand({ Bucket: bucket, Key: path, Body: contents })
  return s3Client.send(command).catch((err: Error) => err)
}

const updateDynamo = async (s3Path: string): Promise<void> => {
  const tableName = process.env.COMPARISON_TABLE ?? "bichard-7-production-comparison-log"
  const { Item: record } = await client
    .get({
      TableName: tableName,
      Key: { s3Path }
    })
    .promise()
  if (!record) {
    throw new Error("Error retrieving record from Dynamo")
  }

  const existingVersion = record.version
  record.skipped = false
  delete record.skippedBy
  delete record.skippedReason
  record.version += 1

  await client
    .put({
      TableName: tableName,
      Item: record,
      ConditionExpression: "attribute_exists(version) and version = :version",
      ExpressionAttributeValues: {
        ":version": existingVersion
      }
    })
    .promise()
}

const fixBinaryEncoding = async (s3Path: string): Promise<void> => {
  const urlMatch = s3Path.match(/s3\:\/\/([^\/]+)\/(.*)/)
  if (!urlMatch) {
    console.error("Invalid S3 Url")
    process.exit()
  }

  const [bucket, path] = urlMatch.slice(1)

  const contents = await getFileFromS3(path, bucket, s3Config)
  if (isError(contents)) {
    throw contents
  }
  console.log("Fetched file from S3")
  const fixed = Buffer.from(contents, "binary").toString("utf8")
  const s3Result = await writeFileToS3(path, bucket, fixed)
  if (isError(s3Result)) {
    throw s3Result
  }
  console.log("Wrote file to S3")
  await updateDynamo(path)
  console.log("Updated Dynamo")
}

const main = async () => {
  const s3Path = process.argv[2]
  await fixBinaryEncoding(s3Path)
}

export default fixBinaryEncoding

if (require.main === module) {
  main()
}
