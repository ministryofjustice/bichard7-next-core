import "tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import type { ImportedComparison } from "src/comparison/types/ImportedComparison"
import createS3Config from "src/lib/createS3Config"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import MockS3 from "tests/helpers/MockS3"
import processPhase1 from "./processPhase1"

const bucket = "phase-1-bucket"
const s3Config = createS3Config()

describe("processPhase1", () => {
  let s3Server: MockS3
  let client: S3Client

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
    await s3Server.start()
    client = new S3Client(s3Config)

    process.env.PHASE_1_BUCKET_NAME = bucket
  })

  afterAll(async () => {
    await s3Server.stop()
  })

  it("should return failure if message XML cannot be parsed", async () => {
    const s3Path = "failure.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: "invalid xml" })
    await client.send(command)

    const result = await processPhase1(s3Path)

    expect(result).toHaveProperty("failure", true)
    expect(result).toHaveProperty("auditLogEvents")
    expect(result.auditLogEvents).toHaveLength(3)
  })

  it("should correctly process an input message that doesn't raise any triggers or exceptions", async () => {
    const comparisonFile = fs.readFileSync("test-data/e2e-comparison/test-019.json")
    const comparison = JSON.parse(comparisonFile.toString()) as ImportedComparison

    const s3Path = "no-triggers-exceptions.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
    await client.send(command)

    const result = (await processPhase1(s3Path)) as Phase1SuccessResult

    expect(result).not.toHaveProperty("failure")
    expect(result.triggers).toHaveLength(0)
    expect(result.hearingOutcome.Exceptions).toHaveLength(0)
    console.log(JSON.stringify(result, null, 2))
  })
})
