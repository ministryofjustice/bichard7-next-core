import type { DeleteObjectCommandOutput, S3ClientConfig } from "@aws-sdk/client-s3"
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { isError, type PromiseResult } from "../types/Result"
import logger from "../utils/logger"

const deleteFileFromS3 = async (fileName: string, bucket: string, config: S3ClientConfig): PromiseResult<void> => {
  const client = new S3Client(config)
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName
  })
  let lastResponse: Error | DeleteObjectCommandOutput | undefined = undefined

  for (let retries = 0; retries < 5; retries++) {
    lastResponse = await client.send(command).catch((err: Error) => err)

    if (lastResponse && !isError(lastResponse)) {
      return
    }
    logger.error(lastResponse)
  }
  return lastResponse ? lastResponse : new Error("Couldn't delete file from S3")
}

export default deleteFileFromS3
