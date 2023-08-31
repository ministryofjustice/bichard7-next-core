import { S3Client } from "@aws-sdk/client-s3"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import postgres from "postgres"
import createDbConfig from "../../lib/database/createDbConfig"
import MockS3 from "../../phase1/tests/helpers/MockS3"

const bucket = "conductor-task-data"
const s3Config = createS3Config()
const dbConfig = createDbConfig()
const sql = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})


describe("readAhoFromDb", () => {
  let s3Server: MockS3
  let s3Client: S3Client

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
    await s3Server.start()
    
    s3Client = new S3Client(s3Config)

    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  afterAll(() => {
    s3Server.stop()
    s3Client.destroy()
  })

  it("should work", () => {
    
  })
})