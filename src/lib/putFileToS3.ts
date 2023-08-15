import type { S3ClientConfig } from "@aws-sdk/client-s3"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { isError } from "../comparison/types"
import logger from "./logging"

const putFileToS3 = async (
  body: string,
  fileName: string,
  bucket: string,
  config: S3ClientConfig
): Promise<void | Error> => {
  const client = new S3Client(config)
  const command = new PutObjectCommand({ Bucket: bucket, Key: fileName, Body: body })

  for (let retries = 0; retries < 5; retries++) {
    const response = await client.send(command).catch((err: Error) => err)

    if (response && !isError(response)) {
      return
    }
    logger.error(response)
  }
  return new Error(`Couldn't put file to S3: ${fileName}`)
}

export default putFileToS3
