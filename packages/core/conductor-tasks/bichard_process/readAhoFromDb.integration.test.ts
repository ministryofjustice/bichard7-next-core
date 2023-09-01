jest.setTimeout(999999)

import "../../phase1/tests/helpers/setEnvironmentVariables"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import fs from "fs"
import postgres from "postgres"
import { v4 as uuid } from "uuid"
import createDbConfig from "../../lib/database/createDbConfig"
import insertErrorListRecord from "../../lib/database/insertErrorListRecord"
import { Phase1ResultType, type Phase1SuccessResult } from "../../phase1/types/Phase1Result"
import { type AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import readAhoFromDb from "./readAhoFromDb"

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
  it("should read AHO from database", async () => {
    const uniqueId = uuid()
    const exampleAho = JSON.parse(
      String(fs.readFileSync("phase1/tests/fixtures/exampleAho-001.json")),
      dateReviver
    ) as AnnotatedHearingOutcome
    exampleAho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = uniqueId
    const successResult: Phase1SuccessResult = {
      correlationId: uniqueId,
      hearingOutcome: exampleAho,
      auditLogEvents: [],
      triggers: [],
      resultType: Phase1ResultType.success
    }

    await insertErrorListRecord(sql, successResult)

    const ahoFile = `${uniqueId}.json`
    const result = await readAhoFromDb.execute({
      inputData: { ahoS3Path: ahoFile, correlationId: successResult.correlationId }
    })

    expect(result).toHaveProperty("status", "COMPLETED")

    const s3File = await getFileFromS3(ahoFile, "conductor-task-data", s3Config)
    const s3Json = JSON.parse(s3File as string, dateReviver)

    expect(s3Json).toStrictEqual(exampleAho)
  })

  it("should fail if there is no correlationId", async () => {
    const result = await readAhoFromDb.execute({
      inputData: { ahoS3Path: "ahoFile" }
    })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if there is no ahoS3Path", async () => {
    const result = await readAhoFromDb.execute({
      inputData: { correlationId: "correlationId" }
    })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if there is no ahoXml", async () => {
    const result = await readAhoFromDb.execute({
      inputData: { correlationId: "correlationId", ahoS3Path: "ahoFile" }
    })

    expect(result).toHaveProperty("status", "FAILED")
  })

  it("should fail if aho is not valid XML", async () => {
    const uniqueId = uuid()
    const exampleAho = JSON.parse(
      String(fs.readFileSync("phase1/tests/fixtures/exampleAho-001.json")),
      dateReviver
    ) as AnnotatedHearingOutcome
    exampleAho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = uniqueId
    const successResult: Phase1SuccessResult = {
      correlationId: uniqueId,
      hearingOutcome: exampleAho,
      auditLogEvents: [],
      triggers: [],
      resultType: Phase1ResultType.success
    }

    await insertErrorListRecord(sql, successResult)

    await sql`update br7own.error_list set updated_msg = 'Bad MSG' where message_id = ${uniqueId}`

    const result = await readAhoFromDb.execute({
      inputData: { correlationId: uniqueId, ahoS3Path: "ahoFile" }
    })

    expect(result).toHaveProperty("status", "FAILED")
  })
})
