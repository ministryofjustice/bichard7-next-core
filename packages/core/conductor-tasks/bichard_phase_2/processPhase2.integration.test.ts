import "../../phase1/tests/helpers/setEnvironmentVariables"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import "jest-xml-matcher"
import postgres from "postgres"
import processPhase2 from "./processPhase2"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"
import { Phase1ResultType } from "../../phase1/types/Phase1Result"
import generateFakePncUpdateDataset from "../../phase2/tests/fixtures/helpers/generateFakePncUpdateDataset"
import type Phase2Result from "../../phase2/types/Phase2Result"
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

describe("processPhase2", () => {
  beforeAll(() => {
    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  beforeEach(async () => {
    await sql`DELETE FROM br7own.error_list`
    mockPutFileToS3.default = putFileToS3
  })

  it("should fail with terminal error if the S3 path is missing", async () => {
    const result = await processPhase2.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })

  it("should fail if it can't fetch the file from S3", async () => {
    const result = await processPhase2.execute({ inputData: { s3TaskDataPath: "missing.json" } })

    expect(result).toHaveProperty("status", "FAILED")
  })

  it("should complete correctly if the phase 2 output was ignored", async () => {
    const inputMessage = generateFakeAho({})
    inputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = false

    const s3TaskDataPath = "bad-aho.json"
    await putFileToS3(JSON.stringify(inputMessage), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase2.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "COMPLETED")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing Outcome ignored as no offences are recordable")
    expect(result.outputData).toHaveProperty("resultType", Phase1ResultType.ignored)
    expect(result.outputData?.auditLogEvents).toHaveLength(2)
  })

  it("should fail if it can't put the file to S3", async () => {
    mockPutFileToS3.default = () => {
      return Promise.resolve(new Error("Mock error"))
    }

    const inputJson = generateFakeAho({})
    const s3TaskDataPath = `${randomUUID()}.json`
    await putFileToS3(JSON.stringify(inputJson), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase2.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs?.map((l) => l.log)).toContain(`Could not put file to S3: ${s3TaskDataPath}`)
    expect(result.logs?.map((l) => l.log)).toContain("Mock error")
  })

  it("should put the processed AHO file back in to S3 and complete correctly", async () => {
    const inputJson = generateFakeAho({})
    const s3TaskDataPath = `${randomUUID()}.json`
    await putFileToS3(JSON.stringify(inputJson), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase2.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "COMPLETED")

    const updatedFile = await getFileFromS3(s3TaskDataPath, bucket, s3Config)
    if (isError(updatedFile)) {
      throw updatedFile
    }

    expect(updatedFile).not.toEqual(inputJson)

    const parsedUpdatedFile = JSON.parse(updatedFile, dateReviver) as Phase2Result
    expect(parsedUpdatedFile.outputMessage).toHaveProperty("PncOperations")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing outcome received by phase 2")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing outcome submitted to phase 3")
  })

  it("should put the processed PNC Update Dataset file back in to S3 and complete correctly", async () => {
    const inputJson = generateFakePncUpdateDataset()
    const s3TaskDataPath = `${randomUUID()}.json`
    await putFileToS3(JSON.stringify(inputJson), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase2.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "COMPLETED")

    const updatedFile = await getFileFromS3(s3TaskDataPath, bucket, s3Config)
    if (isError(updatedFile)) {
      throw updatedFile
    }

    expect(updatedFile).not.toEqual(inputJson)

    const parsedUpdatedFile = JSON.parse(updatedFile, dateReviver) as Phase2Result
    expect(parsedUpdatedFile.outputMessage).toHaveProperty("PncOperations")
    expect(result.logs?.map((l) => l.log)).toContain("Resubmitted hearing outcome received")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing outcome submitted to phase 3")
  })
})
