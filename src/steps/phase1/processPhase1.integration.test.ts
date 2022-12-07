jest.setTimeout(9999999)
import "tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import MockDate from "mockdate"
import postgres from "postgres"
import type { ImportedComparison } from "src/comparison/types/ImportedComparison"
import createDbConfig from "src/lib/createDbConfig"
import createS3Config from "src/lib/createS3Config"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type ErrorListRecord from "src/types/ErrorListRecord"
import type ErrorListTriggerRecord from "src/types/ErrorListTriggerRecord"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import generateMockPncQueryResultFromAho from "tests/helpers/generateMockPncQueryResultFromAho"
import MockS3 from "tests/helpers/MockS3"
import processTestFile from "tests/helpers/processTestFile"
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

const extractAsnFromAhoXml = (ahoXml: string): string | void => {
  const matchResult = ahoXml.match(/<DC:ProsecutorReference>([^<]*)<\/DC:ProsecutorReference>/)
  if (matchResult) {
    return matchResult[1]
  }
}

const extractPncQueryDateFromAhoXml = (ahoXml: string): Date => {
  const matchResult = ahoXml.match(/<br7:PNCQueryDate>([^<]*)<\/br7:PNCQueryDate>/)
  if (matchResult) {
    return new Date(matchResult[1])
  }

  return new Date()
}

// const parseErrorReport = (report: string): { code: string; element: string }[] =>
//   report
//     .split(", ")
//     .map((err) => ({ code: err.split("||")[0], element: err.split("||")[1] }))
//     .sort((a, b) => a.code.localeCompare(b.code))

const checkDatabaseMatches = async (expected: any): Promise<void> => {
  const errorList = await sql<ErrorListRecord[]>`select * from BR7OWN.ERROR_LIST`
  const errorListTriggers = await sql<ErrorListTriggerRecord[]>`select * from BR7OWN.ERROR_LIST_TRIGGERS`
  const expectedTriggers = errorListTriggers.map((trigger) => trigger.trigger_code)

  expect(errorList).toHaveLength(expected.errorList.length)
  expect(errorListTriggers).toHaveLength(expected.errorListTriggers.length)
  if (expected.errorList.length === 1) {
    expect(errorList[0].message_id).toEqual(expected.errorList[0].message_id)
    expect(errorList[0].phase).toEqual(expected.errorList[0].phase)
    expect(errorList[0].error_status).toEqual(expected.errorList[0].error_status)
    expect(errorList[0].trigger_status).toEqual(expected.errorList[0].trigger_status)
    expect(errorList[0].error_quality_checked).toEqual(expected.errorList[0].error_quality_checked)
    expect(errorList[0].trigger_quality_checked).toEqual(expected.errorList[0].trigger_quality_checked)
    expect(errorList[0].trigger_count).toEqual(expected.errorList[0].trigger_count)
    expect(errorList[0].error_locked_by_id).toEqual(expected.errorList[0].error_locked_by_id)
    expect(errorList[0].trigger_locked_by_id).toEqual(expected.errorList[0].trigger_locked_by_id)
    expect(errorList[0].is_urgent).toEqual(expected.errorList[0].is_urgent)
    expect(errorList[0].asn).toEqual(expected.errorList[0].asn)
    expect(errorList[0].court_code).toEqual(expected.errorList[0].court_code)
    expect(errorList[0].annotated_msg).toEqualXML(expected.errorList[0].annotated_msg)
    expect(errorList[0].updated_msg).toEqualXML(expected.errorList[0].updated_msg)
    expect(errorList[0].error_report).toStrictEqual(expected.errorList[0].error_report)
    expect(errorList[0].create_ts).toBeDefined()
    expect(errorList[0].error_reason).toEqual(expected.errorList[0].error_reason)
    if (expected.errorList[0].trigger_reason) {
      expect(expectedTriggers).toContain(errorList[0].trigger_reason)
    } else {
      expect(errorList[0].trigger_reason).toBeNull()
    }
    expect(errorList[0].error_count).toEqual(expected.errorList[0].error_count)
    expect(errorList[0].user_updated_flag).toEqual(expected.errorList[0].user_updated_flag)
    expect(errorList[0].court_date).toEqual(expected.errorList[0].court_date)
    expect(errorList[0].ptiurn).toEqual(expected.errorList[0].ptiurn)
    expect(errorList[0].court_name).toEqual(expected.errorList[0].court_name)
    expect(errorList[0].resolution_ts).toEqual(expected.errorList[0].resolution_ts)
    expect(errorList[0].msg_received_ts).toBeDefined()
    expect(errorList[0].error_resolved_by).toEqual(expected.errorList[0].error_resolved_by)
    expect(errorList[0].trigger_resolved_by).toEqual(expected.errorList[0].trigger_resolved_by)
    expect(errorList[0].error_resolved_ts).toEqual(expected.errorList[0].error_resolved_ts)
    expect(errorList[0].trigger_resolved_ts).toEqual(expected.errorList[0].trigger_resolved_ts)
    expect(errorList[0].defendant_name).toEqual(expected.errorList[0].defendant_name)
    expect(errorList[0].org_for_police_filter).toEqual(expected.errorList[0].org_for_police_filter)
    expect(errorList[0].court_room).toEqual(expected.errorList[0].court_room)
    expect(errorList[0].court_reference).toEqual(expected.errorList[0].court_reference)
    expect(errorList[0].error_insert_ts).toBeDefined()
    expect(errorList[0].trigger_insert_ts).toBeDefined()
    expect(errorList[0].pnc_update_enabled).toEqual(expected.errorList[0].pnc_update_enabled)
  }
}

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

    expect(result).toHaveProperty("failure", true)
    expect(result).toHaveProperty("auditLogEvents")
    expect(result.auditLogEvents).toHaveLength(3)
  })
  it.each([
    "test-data/e2e-comparison/test-019.json",
    "test-data/e2e-comparison/test-036.json",
    "test-data/e2e-comparison/test-054.json"
  ])(
    "should correctly process an input message that doesn't raise any triggers or exceptions for %s",
    async (file: string) => {
      const comparisonFile = fs.readFileSync(file)
      const comparison = JSON.parse(comparisonFile.toString()) as ImportedComparison
      const asn = extractAsnFromAhoXml(comparison.incomingMessage)
      const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
      MockDate.set(pncQueryDate)

      const s3Path = "no-triggers-exceptions.xml"
      const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
      await client.send(command)

      const mockPncResult = generateMockPncQueryResultFromAho(comparison.annotatedHearingOutcome)
      if (mockPncResult) {
        pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
          ctx.status = 200
          ctx.body = mockPncResult
        })
      } else {
        pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
          ctx.status = 404
          ctx.body = "{}"
        })
      }

      const result = (await processPhase1(s3Path)) as Phase1SuccessResult
      expect(result).not.toHaveProperty("failure")
      expect(result.triggers).toStrictEqual(comparison.triggers)

      const resultXml = convertAhoToXml(result.hearingOutcome)
      expect(resultXml).toEqualXML(comparison.annotatedHearingOutcome)
    }
  )

  it.each([
    "test-data/e2e-comparison/test-001.json",
    "test-data/e2e-comparison/test-032.json",
    "test-data/e2e-comparison/test-043.json"
  ])("should correctly process an input message that only raises triggers for %s", async (file: string) => {
    const comparison = processTestFile(file)
    const asn = extractAsnFromAhoXml(comparison.incomingMessage)
    const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
    MockDate.set(pncQueryDate)

    const s3Path = "triggers-exceptions.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
    await client.send(command)

    pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = generateMockPncQueryResultFromAho(comparison.annotatedHearingOutcome)
    })

    const result = (await processPhase1(s3Path)) as Phase1SuccessResult
    expect(result).not.toHaveProperty("failure")
    expect(result.triggers).toStrictEqual(comparison.triggers)

    const resultXml = convertAhoToXml(result.hearingOutcome)
    expect(resultXml).toEqualXML(comparison.annotatedHearingOutcome)

    await checkDatabaseMatches(comparison.dbContent)
  })

  it.each([
    "test-data/e2e-comparison/test-021.json",
    "test-data/e2e-comparison/test-089.json",
    "test-data/e2e-comparison/test-127.json"
  ])("should correctly process an input message that only raises exceptions for %s", async (file: string) => {
    const comparison = processTestFile(file)
    const asn = extractAsnFromAhoXml(comparison.incomingMessage)
    const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
    MockDate.set(pncQueryDate)

    const s3Path = "triggers-exceptions.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
    await client.send(command)

    pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = generateMockPncQueryResultFromAho(comparison.annotatedHearingOutcome)
    })

    const result = (await processPhase1(s3Path)) as Phase1SuccessResult
    expect(result).not.toHaveProperty("failure")
    expect(result.triggers).toStrictEqual(comparison.triggers)

    const resultXml = convertAhoToXml(result.hearingOutcome)
    expect(resultXml).toEqualXML(comparison.annotatedHearingOutcome)

    await checkDatabaseMatches(comparison.dbContent)
  })

  it.each([
    "test-data/e2e-comparison/test-013.json",
    "test-data/e2e-comparison/test-081.json",
    "test-data/e2e-comparison/test-120.json"
  ])("should correctly process an input message that raises triggers and exceptions for %s", async (file: string) => {
    const comparison = processTestFile(file)
    const asn = extractAsnFromAhoXml(comparison.incomingMessage)
    const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
    MockDate.set(pncQueryDate)

    const s3Path = "triggers-exceptions.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
    await client.send(command)

    pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = generateMockPncQueryResultFromAho(comparison.annotatedHearingOutcome)
    })

    const result = (await processPhase1(s3Path)) as Phase1SuccessResult
    expect(result).not.toHaveProperty("failure")
    expect(result.triggers).toStrictEqual(comparison.triggers)

    const resultXml = convertAhoToXml(result.hearingOutcome)
    expect(resultXml).toEqualXML(comparison.annotatedHearingOutcome)

    await checkDatabaseMatches(comparison.dbContent)
  })

  it.skip.each(["test-data/e2e-comparison/test-035.json"])(
    "should correctly process an input message that is ignored for %s",
    async (file: string) => {
      const comparison = processTestFile(file)
      const asn = extractAsnFromAhoXml(comparison.incomingMessage)
      const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
      MockDate.set(pncQueryDate)

      const s3Path = "triggers-exceptions.xml"
      const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
      await client.send(command)

      pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
        ctx.status = 200
        ctx.body = generateMockPncQueryResultFromAho(comparison.annotatedHearingOutcome)
      })

      const result = (await processPhase1(s3Path)) as Phase1SuccessResult
      expect(result).not.toHaveProperty("failure")
      expect(result.triggers).toStrictEqual(comparison.triggers)

      const resultXml = convertAhoToXml(result.hearingOutcome)
      expect(resultXml).toEqualXML(comparison.annotatedHearingOutcome)

      await checkDatabaseMatches(comparison.dbContent)
    }
  )
})
