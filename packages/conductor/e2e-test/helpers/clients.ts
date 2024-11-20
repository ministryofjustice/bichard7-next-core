import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import { SQSClient } from "@aws-sdk/client-sqs"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"

const endpoint = (process.env.S3_ENDPOINT = "http://localhost:4566")
const accessKeyId = (process.env.S3_AWS_ACCESS_KEY_ID = "FAKE")
const secretAccessKey = (process.env.S3_AWS_SECRET_ACCESS_KEY = "FAKE")

const s3Client = new S3Client(createS3Config())

const dbClient = new DynamoDBClient({
  credentials: { accessKeyId, secretAccessKey },
  endpoint,
  region: "eu-west-2"
})

const sqsClient = new SQSClient({
  credentials: { accessKeyId, secretAccessKey },
  endpoint,
  region: "eu-west-2"
})

export { dbClient, s3Client, sqsClient }
