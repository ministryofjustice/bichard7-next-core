import type { S3ClientConfig } from "@aws-sdk/client-s3"
import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

import { format } from "date-fns"
import getUtcDate from "../utils/getUtcDate"

type IncomingMessageBucketConfig = {
  region: string
  url: string
  incomingMessageBucketName: string
}

class IncomingMessageBucket {
  s3Client: S3Client
  incomingMessageBucketName: string
  uploadedS3Files: string[]

  constructor(config: IncomingMessageBucketConfig) {
    const options: S3ClientConfig = {
      region: config.region,
      forcePathStyle: true
    }

    if (config.url && config.url !== "none") {
      options.endpoint = config.url
      options.credentials = {
        accessKeyId: "test",
        secretAccessKey: "test"
      }
    }

    this.s3Client = new S3Client(options)
    this.incomingMessageBucketName = config.incomingMessageBucketName
    this.uploadedS3Files = []
  }

  upload(message: string, correlationId: string) {
    const receivedDateUtc = getUtcDate(new Date())
    const s3FileName = `${format(receivedDateUtc, "yyyy/MM/dd/HH/mm")}/${correlationId}.xml`
    this.uploadedS3Files.push(s3FileName)

    const params = {
      Bucket: this.incomingMessageBucketName,
      Key: s3FileName,
      Body: message
    }

    return new Upload({
      client: this.s3Client,
      params
    })
      .done()
      .then(() => s3FileName)
      .catch((error: Error) => error)
  }
}

export default IncomingMessageBucket
