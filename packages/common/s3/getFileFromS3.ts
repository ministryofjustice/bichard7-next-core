import type { GetObjectCommandOutput, S3ClientConfig } from "@aws-sdk/client-s3"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import type { Readable } from "stream"
import { isError } from "../types/Result"
import logger from "../utils/logger"

const streamToBuffer = (stream: Readable) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on("data", (chunk) => chunks.push(chunk))
    stream.once("end", () => resolve(Buffer.concat(chunks)))
    stream.once("error", reject)
  })

const getFileFromS3 = async (fileName: string, bucket: string, config: S3ClientConfig): Promise<string | Error> => {
  const client = new S3Client(config)
  const command = new GetObjectCommand({ Bucket: bucket, Key: fileName })
  let lastResponse: Error | GetObjectCommandOutput | undefined = undefined

  for (let retries = 0; retries < 5; retries++) {
    lastResponse = await client.send(command).catch((err: Error) => err)

    if (lastResponse && !isError(lastResponse) && "Body" in lastResponse) {
      const stream = lastResponse.Body as Readable
      const buffer = await streamToBuffer(stream)
      return buffer.toString()
    }
    logger.error(lastResponse)
  }
  if (!isError(lastResponse)) {
    return new Error("No body in get object output")
  }
  return lastResponse ? lastResponse : new Error("Couldn't retrieve file from S3")
}

export default getFileFromS3
