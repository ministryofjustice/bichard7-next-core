import type { S3ClientConfig } from "@aws-sdk/client-s3"
import { GetObjectTaggingCommand, S3Client } from "@aws-sdk/client-s3"
import { isError } from "../types/Result"

const readS3FileTags = async (
  fileName: string,
  bucket: string,
  config: S3ClientConfig
): Promise<Record<string, string> | Error> => {
  const client = new S3Client(config)
  const command = new GetObjectTaggingCommand({ Bucket: bucket, Key: fileName })

  const response = await client.send(command).catch((err: Error) => err)

  if (isError(response)) {
    return response
  }

  if (!response.TagSet) {
    return {}
  }

  return response.TagSet.reduce((acc: Record<string, string>, tag) => {
    if (tag.Key && tag.Value) {
      acc[tag.Key] = tag.Value
    }

    return acc
  }, {})
}

export default readS3FileTags
