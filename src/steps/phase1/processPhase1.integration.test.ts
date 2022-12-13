import "tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import postgres from "postgres"
import createDbConfig from "src/lib/createDbConfig"
import createS3Config from "src/lib/createS3Config"
import { Phase1ResultType } from "src/types/Phase1Result"
import MockS3 from "tests/helpers/MockS3"
import processPhase1 from "./processPhase1"

const bucket = "phase-1-bucket"
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

describe("processPhase1", () => {
  let s3Server: MockS3
  let client: S3Client
  let pncApi: MockServer

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
    await s3Server.start()
    client = new S3Client(s3Config)

    pncApi = new MockServer({ port: 11000 })
    await pncApi.start()

    process.env.PHASE_1_BUCKET_NAME = bucket
  })

  afterAll(async () => {
    await s3Server.stop()
    await client.destroy()
    await pncApi.stop()
  })

  beforeEach(async () => {
    await sql`DELETE FROM br7own.error_list`
  })

  it("should return failure if message XML cannot be parsed", async () => {
    const s3Path = "failure.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: "invalid xml" })
    await client.send(command)

    const result = await processPhase1(s3Path)

    expect(result.resultType).toEqual(Phase1ResultType.failure)
    expect(result).toHaveProperty("auditLogEvents")
    expect(result.auditLogEvents).toHaveLength(2)
  })

  it("should write triggers to the database if they are raised", async () => {
    const s3Path = "trigger.xml"
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Path,
      Body: fs.readFileSync("test-data/AnnotatedHO1.xml")
    })
    await client.send(command)

    const result = await processPhase1(s3Path)

    expect(result.resultType).toEqual(Phase1ResultType.success)

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(3)
  })

  it("should write exceptions to the database if they are raised", async () => {
    const s3Path = "exception.xml"
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Path,
      Body: fs.readFileSync("test-data/input-message-089.xml")
    })
    await client.send(command)

    const result = await processPhase1(s3Path)

    expect(result.resultType).toEqual(Phase1ResultType.exceptions)

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_reason).toBe("HO100322")

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(0)
  })
})
