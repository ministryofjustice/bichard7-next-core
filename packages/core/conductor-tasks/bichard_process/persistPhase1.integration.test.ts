import "../../phase1/tests/helpers/setEnvironmentVariables"

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import postgres from "postgres"
import createDbConfig from "../../lib/database/createDbConfig"
import { test1PncResponse, test89PncResponse } from "../../phase1/tests/fixtures/mockPncApiResponses"
import persistPhase1 from "./persistPhase1"

import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
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

describe("persistPhase1", () => {
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

  it("should write triggers to the database if they are raised", async () => {
    pncApi.get("/pnc/records/1101ZD0100000448754K").mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = test1PncResponse
    })

    const phase1Result = String(fs.readFileSync("phase1/tests/fixtures/input-message-001-phase1-result.json"))
    const ahoS3Path = "trigger.xml"
    await putFileToS3(phase1Result, ahoS3Path, bucket, s3Config)

    const result = await persistPhase1.execute({ inputData: { ahoS3Path } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(3)
  })

  it("should write exceptions to the database if they are raised", async () => {
    pncApi.get("/pnc/records/1101ZD0100000410837W").mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = test89PncResponse
    })

    const phase1Result = String(fs.readFileSync("phase1/tests/fixtures/input-message-089-phase1-result.json"))
    const ahoS3Path = "exception.xml"
    await putFileToS3(phase1Result, ahoS3Path, bucket, s3Config)

    const result = await persistPhase1.execute({ inputData: { ahoS3Path } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_reason).toBe("HO100322")

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(0)
  })

  it("should fail with terminal error if the S3 path is missing", async () => {
    const result = await persistPhase1.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if it can't fetch the file from S3", async () => {
    const result = await persistPhase1.execute({ inputData: { ahoS3Path: "missing.json" } })

    expect(result).toHaveProperty("status", "FAILED")
  })

  it("should fail with terminal error if the result cannot be parsed", async () => {
    const phase1Result = String(
      fs.readFileSync("phase1/tests/fixtures/input-message-001-phase1-result-missing-result-type.json")
    )

    const ahoS3Path = "missing_result_type.xml"
    await putFileToS3(phase1Result, ahoS3Path, bucket, s3Config)

    const result = await persistPhase1.execute({ inputData: { ahoS3Path } })
    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")

    const [generalError, zodError] = result.logs!
    expect(generalError.log).toBe("Failed parsing phase 1 result")
    expect(zodError.log).toContain('"path":["resultType"],"message":"Required"')
    // TODO: expect zod error
  })
})
