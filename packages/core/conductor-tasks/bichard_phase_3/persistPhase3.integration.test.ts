import "../../phase1/tests/helpers/setEnvironmentVariables"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
import fs from "fs"
import "jest-xml-matcher"
import postgres from "postgres"

import persistPhase3 from "./persistPhase3"
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

describe("persistPhase3", () => {
  beforeAll(() => {
    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  beforeEach(async () => {
    await sql`DELETE FROM br7own.error_list`
    mockPutFileToS3.default = putFileToS3
  })

  it("should write triggers to the database if they are raised", async () => {
    const phase1Result = String(fs.readFileSync("phase3/tests/fixtures/input-message-001-phase3-result.json"))
    const s3TaskDataPath = "trigger.xml"
    await putFileToS3(phase1Result, s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase3.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(3)
  })

  it("should write exceptions to the database if they are raised", async () => {
    const phase1Result = String(
      fs.readFileSync("phase3/tests/fixtures/input-message-001-phase3-result-with-exceptions.json")
    )
    const s3TaskDataPath = "exception.xml"
    await putFileToS3(phase1Result, s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase3.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_reason).toBe("HO100206")

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(0)
  })

  it("should fail with terminal error if the S3 path is missing", async () => {
    const result = await persistPhase3.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })

  it("should fail if it can't fetch the file from S3", async () => {
    const result = await persistPhase3.execute({ inputData: { s3TaskDataPath: "missing.json" } })

    expect(result).toHaveProperty("status", "FAILED")
  })

  it("should fail with terminal error if the result cannot be parsed", async () => {
    const s3TaskDataPath = "missing_result_type.xml"
    await putFileToS3("{}", s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase3.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")

    const [generalError] = result.logs!
    expect(generalError.log).toBe("S3 data schema parse error: Expected array for auditLogEvents")
  })
})
