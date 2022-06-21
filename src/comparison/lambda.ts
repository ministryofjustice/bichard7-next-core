import compare from "src/comparison/compare"
import { z } from "zod"
import type { ComparisonResult } from "./compare"
import createS3Config from "./createS3Config"
import getFileFromS3 from "./getFileFromS3"

const s3Config = createS3Config()

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
