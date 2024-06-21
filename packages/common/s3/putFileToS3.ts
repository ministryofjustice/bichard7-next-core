import type { PutObjectCommandOutput, S3ClientConfig } from "@aws-sdk/client-s3"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { isError } from "../types/Result"
import logger from "../utils/logger"

const putFileToS3 = async (
  body: string,
  fileName: string,
  bucket: string,
  config: S3ClientConfig,
  tags: Record<string, string> = {}
): Promise<void | Error> => {
  const client = new S3Client(config)
  const Tagging = Object.entries(tags)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
  const command = new PutObjectCommand({ Bucket: bucket, Key: fileName, Body: body, Tagging })
  let lastResponse: Error | PutObjectCommandOutput | undefined = undefined

  for (let retries = 0; retries < 5; retries++) {
    lastResponse = await client.send(command).catch((err: Error) => err)

    if (lastResponse && !isError(lastResponse)) {
      return
    }

    logger.error(lastResponse)
  }

  return lastResponse ?? new Error("Error putting file to S3")
}

export default putFileToS3
