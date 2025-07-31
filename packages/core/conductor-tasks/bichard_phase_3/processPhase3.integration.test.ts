import "../../tests/helpers/setEnvironmentVariables"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import "jest-xml-matcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { randomUUID } from "crypto"
import { MockServer } from "jest-mock-server"
import postgres from "postgres"

import type Phase3Result from "../../phase3/types/Phase3Result"

import generateFakePncUpdateDataset from "../../phase2/tests/fixtures/helpers/generateFakePncUpdateDataset"
import { PncOperation } from "../../types/PncOperation"
import processPhase3 from "./processPhase3"
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

describe("processPhase3", () => {
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
    const result = await processPhase3.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })

  it("should fail if it can't fetch the file from S3", async () => {
    const result = await processPhase3.execute({ inputData: { s3TaskDataPath: "missing.json" } })

    expect(result).toHaveProperty("status", "FAILED")
  })

  it("should fail if it can't put the file to S3", async () => {
    pncApi.post("/pnc/records/sentence-deferred").mockImplementationOnce((ctx) => {
      ctx.status = 204
    })

    const loggerSpy = jest.spyOn(logger, "error")
    mockPutFileToS3.default = () => {
      return Promise.resolve(new Error("Mock error"))
    }

    const inputJson = generateFakePncUpdateDataset({
      PncOperations: [
        {
          code: PncOperation.SENTENCE_DEFERRED,
          data: { courtCaseReference: "abcdefg12345678" },
          status: "NotAttempted"
        }
      ]
    })
    const s3TaskDataPath = `${randomUUID()}.json`
    await putFileToS3(JSON.stringify(inputJson), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase3.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs?.map((l) => l.log)).toContain(`Could not put file to S3: ${s3TaskDataPath}`)
    expect(result.logs?.map((l) => l.log)).toContain("Mock error")
    expect(loggerSpy).toHaveBeenCalledWith({
      correlationId: "CID-332cc4c7-f0cd-44c8-9b05-c460bdfd2184",
      message: `Could not put file to S3: ${s3TaskDataPath}. Message: Mock error`,
      operations: [
        {
          code: PncOperation.SENTENCE_DEFERRED,
          data: { courtCaseReference: "abcdefg12345678" },
          status: "Completed"
        }
      ]
    })
  })

  it("should put the result into S3 and complete correctly", async () => {
    pncApi.post("/pnc/records/sentence-deferred").mockImplementationOnce((ctx) => {
      ctx.status = 204
    })
    const inputJson = generateFakePncUpdateDataset({
      PncOperations: [
        {
          code: PncOperation.SENTENCE_DEFERRED,
          data: { courtCaseReference: "abcdefg12345678" },
          status: "NotAttempted"
        }
      ]
    })
    const s3TaskDataPath = `${randomUUID()}.json`
    await putFileToS3(JSON.stringify(inputJson), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase3.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "COMPLETED")

    const updatedFile = await getFileFromS3(s3TaskDataPath, bucket, s3Config)
    if (isError(updatedFile)) {
      throw updatedFile
    }

    expect(updatedFile).not.toEqual(inputJson)

    const parsedUpdatedFile = JSON.parse(updatedFile, dateReviver) as Phase3Result
    expect(parsedUpdatedFile.outputMessage.PncOperations[0].status).toBe("Completed")
    expect(result.logs?.map((l) => l.log)).toContain("Hearing outcome received by phase 3")
  })

  it("should fail when Phase 3 returns an error", async () => {
    pncApi.post("/pnc/records/sentence-deferred").mockImplementationOnce((ctx) => {
      ctx.status = 204
    })
    const invalidCourtCaseReference = "abcdefg12345678aasdfsdf"
    const inputJson = generateFakePncUpdateDataset({
      PncOperations: [
        {
          code: PncOperation.SENTENCE_DEFERRED,
          data: { courtCaseReference: invalidCourtCaseReference },
          status: "NotAttempted"
        }
      ]
    })
    const s3TaskDataPath = `${randomUUID()}.json`
    await putFileToS3(JSON.stringify(inputJson), s3TaskDataPath, bucket, s3Config)

    const result = await processPhase3.execute({ inputData: { s3TaskDataPath } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs).toContainEqual(expect.objectContaining({ log: "Unexpected failure processing phase 3" }))
    expect(result.logs).toContainEqual(
      expect.objectContaining({
        log: "Operation 0: Court Case Reference Number length must be 15, but the length is 23"
      })
    )
  })
})
