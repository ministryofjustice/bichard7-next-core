import type { S3ClientConfig } from "@aws-sdk/client-s3"
import compare from "src/comparison/compare"
import { z } from "zod"
import type { ComparisonResult } from "./compare"
import getFileFromS3 from "./getFileFromS3"

const s3Config: S3ClientConfig = {
  endpoint: process.env.S3_ENDPOINT ?? "https://s3.eu-west-2.amazonaws.com",
  region: process.env.S3_REGION ?? "eu-west-2",
  forcePathStyle: true
}
if (process.env.S3_AWS_ACCESS_KEY_ID && process.env.S3_AWS_ACCESS_KEY_ID) {
  s3Config.credentials = {
    accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_AWS_ACCESS_KEY_ID
  }
}

const inputSchema = z.object({
  detail: z.object({
    bucket: z.object({ name: z.string() }),
    object: z.object({ key: z.string() })
  })
})

export default async (event: unknown): Promise<ComparisonResult> => {
  const parsedEvent = inputSchema.parse(event)

  const bucket = parsedEvent.detail.bucket.name
  const s3Path = parsedEvent.detail.object.key

  console.log(`Retrieving file from S3: ${s3Path}`)
  const content = await getFileFromS3(s3Path, bucket, s3Config)
  if (content instanceof Error) {
    throw content
  }
  return compare(content)
}
