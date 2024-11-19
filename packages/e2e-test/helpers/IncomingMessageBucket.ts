import { S3 } from "aws-sdk"
import { format } from "date-fns"
import getUtcDate from "../utils/getUtcDate"

type IncomingMessageBucketConfig = {
  region: string
  url: string
  incomingMessageBucketName: string
}

class IncomingMessageBucket {
  s3Client: S3
  incomingMessageBucketName: string
  uploadedS3Files: string[]

  constructor(config: IncomingMessageBucketConfig) {
    const options: S3.Types.ClientConfiguration = {
      region: config.region,
      s3ForcePathStyle: true
    }

    if (config.url && config.url !== "none") {
      options.endpoint = config.url
      options.credentials = {
        accessKeyId: "test",
        secretAccessKey: "test"
      }
    }

    this.s3Client = new S3(options)
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

    return this.s3Client
      .upload(params)
      .promise()
      .then(() => s3FileName)
      .catch((error) => error)
  }
}

export default IncomingMessageBucket
