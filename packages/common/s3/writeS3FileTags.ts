import type { S3ClientConfig } from "@aws-sdk/client-s3"
import { PutObjectTaggingCommand, S3Client } from "@aws-sdk/client-s3"
import { isError } from "../types/Result"

const writeS3FileTags = async (
  fileName: string,
  bucket: string,
  tags: Record<string, string>,
  config: S3ClientConfig
): Promise<void | Error> => {
  const client = new S3Client(config)
  const TagSet = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))

  const command = new PutObjectTaggingCommand({ Bucket: bucket, Key: fileName, Tagging: { TagSet } })

  const response = await client.send(command).catch((err: Error) => err)

  if (isError(response)) {
    return response
  }
}

export default writeS3FileTags
