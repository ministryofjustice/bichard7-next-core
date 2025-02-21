import S3rver from "s3rver"
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3"

export default class MockS3 {
  private readonly server: S3rver

  private readonly port = 21001

  private readonly bucket: string

  constructor(bucket: string) {
    this.bucket = bucket
    this.server = new S3rver({
      port: this.port,
      address: "localhost",
      silent: true,
      configureBuckets: [
        {
          name: bucket,
          configs: []
        }
      ]
    })
  }

  start(): Promise<void> {
    return new Promise<void>((resolve) => this.server.run(() => resolve()))
  }

  reset(): Promise<void> {
    this.server.reset()
    const client = new S3Client({
      region: "local",
      endpoint: `http://localhost:${this.port}`,
      credentials: { accessKeyId: "S3RVER", secretAccessKey: "S3RVER" }
    })
    const command = new CreateBucketCommand({ Bucket: this.bucket })
    return client.send(command).catch((e) => e)
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve) => this.server.close(() => resolve()))
  }
}
