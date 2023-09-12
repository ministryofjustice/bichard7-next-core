import "../../phase1/tests/helpers/setEnvironmentVariables"

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import postgres from "postgres"
import createDbConfig from "../../lib/database/createDbConfig"
import { test89PncResponse } from "../../phase1/tests/fixtures/mockPncApiResponses"
import { Phase1ResultType } from "../../phase1/types/Phase1Result"
import processPhase1 from "./processPhase1"

import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
const putFileToS3 = putFileToS3Module.default
const mockPutFileToS3 = putFileToS3Module as { default: any }

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

describe("processPhase1", () => {
  let pncApi: MockServer

  beforeAll(async () => {
    pncApi = new MockServer({ port: 11000 })
    await pncApi.start()

    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  afterAll(() => {
    pncApi.stop()
  })

  beforeEach(async () => {
    pncApi.reset()
    await sql`DELETE FROM br7own.error_list`
    mockPutFileToS3.default = putFileToS3
  })

  it("should fail with terminal error if the S3 path is missing", async () => {
    const result = await processPhase1.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if it can't fetch the file from S3", async () => {
    const result = await processPhase1.execute({ inputData: { ahoS3Path: "missing.json" } })

    expect(result).toHaveProperty("status", "FAILED")
  })

  it("should complete correctly if the phase 1 output was a failure", async () => {
    const ahoS3Path = "bad-aho.json"
    await putFileToS3("{}", ahoS3Path, bucket, s3Config)
    const result = await processPhase1.execute({ inputData: { ahoS3Path } })

    expect(result).toHaveProperty("status", "COMPLETED")
    expect(result.logs?.map((l) => l.log)).toContain("Message Rejected by CoreHandler")
    expect(result.outputData?.phase1Result).toHaveProperty("resultType", Phase1ResultType.failure)
    expect(result.outputData?.phase1Result.auditLogEvents).toHaveLength(2)
  })

  it("should complete correctly if the phase 1 output was ignored", async () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-no-offences.json"))

    const ahoS3Path = "bad-aho.json"
    await putFileToS3(inputMessage, ahoS3Path, bucket, s3Config)
    const result = await processPhase1.execute({ inputData: { ahoS3Path } })
    expect(result).toHaveProperty("status", "COMPLETED")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing Outcome ignored as it contains no offences")
    expect(result.outputData?.phase1Result).toHaveProperty("resultType", Phase1ResultType.ignored)
    expect(result.outputData?.phase1Result.auditLogEvents).toHaveLength(2)
  })

  it("should fail if it can't put the file to S3", async () => {
    mockPutFileToS3.default = () => {
      return Promise.resolve(new Error("Mock error"))
    }

    pncApi.get("/pnc/records/1101ZD0100000410837W").mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = test89PncResponse
    })

    const inputAhoJson = String(fs.readFileSync("phase1/tests/fixtures/input-message-089.json"))
    const ahoS3Path = `${randomUUID()}.json`
    await putFileToS3(inputAhoJson, ahoS3Path, bucket, s3Config)

    const result = await processPhase1.execute({ inputData: { ahoS3Path } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs?.map((l) => l.log)).toContain(`Could not put file to S3: ${ahoS3Path}`)
    expect(result.logs?.map((l) => l.log)).toContain("Mock error")
  })

  it("should put the processed file back in to S3 and complete correctly", async () => {
    pncApi.get("/pnc/records/1101ZD0100000410837W").mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = test89PncResponse
    })

    const inputAhoJson = String(fs.readFileSync("phase1/tests/fixtures/input-message-089.json"))
    const ahoS3Path = `${randomUUID()}.json`
    await putFileToS3(inputAhoJson, ahoS3Path, bucket, s3Config)

    const result = await processPhase1.execute({ inputData: { ahoS3Path } })

    expect(result).toHaveProperty("status", "COMPLETED")

    const updatedFile = await getFileFromS3(ahoS3Path, bucket, s3Config)
    if (isError(updatedFile)) {
      throw updatedFile
    }
    expect(updatedFile).not.toEqual(inputAhoJson)

    const parsedUpdatedFile = JSON.parse(updatedFile)
    expect(parsedUpdatedFile).toHaveProperty("PncQuery")
    expect(parsedUpdatedFile).toHaveProperty("PncQueryDate")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing outcome details")
    expect(result.logs?.map((l) => l.log)).toContain("Exceptions generated")
  })
})
