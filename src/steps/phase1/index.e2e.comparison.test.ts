/* eslint-disable jest/no-conditional-expect */
import "tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import orderBy from "lodash.orderby"
import MockDate from "mockdate"
import postgres from "postgres"
import type { OldPhase1Comparison } from "src/comparison/types/ComparisonFile"
import type { ImportedComparison } from "src/comparison/types/ImportedComparison"
import createDbConfig from "src/lib/createDbConfig"
import createS3Config from "src/lib/createS3Config"
import { createMqConfig, TestMqGateway } from "src/lib/MqGateway"
import { extractExceptionsFromAho } from "src/parse/parseAhoXml"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type ErrorListRecord from "src/types/ErrorListRecord"
import type ErrorListTriggerRecord from "src/types/ErrorListTriggerRecord"
import type KeyValuePair from "src/types/KeyValuePair"
import generateMockPncQueryResultFromAho from "tests/helpers/generateMockPncQueryResultFromAho"
import MockS3 from "tests/helpers/MockS3"
import processTestFile from "tests/helpers/processTestFile"
import phase1 from "./"

const bucket = process.env.PHASE_1_BUCKET_NAME as string
const phase2Queue = process.env.PHASE_2_QUEUE_NAME as string
const s3Config = createS3Config()
const dbConfig = createDbConfig()

const testMqGateway = new TestMqGateway(createMqConfig())

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

const normaliseTriggers = (triggers: ErrorListTriggerRecord[]): ErrorListTriggerRecord[] =>
  orderBy(triggers, ["trigger_code", "trigger_item_identity"]).map(
    ({ trigger_code, status, trigger_item_identity }) => ({
      trigger_code,
      status,
      trigger_item_identity,
      error_id: 0,
      create_ts: new Date("2000-01-01")
    })
  )

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

const normaliseAttributeDetails = (attributes: KeyValuePair<string, unknown>): KeyValuePair<string, unknown> => {
  if (attributes["Trigger 1 Details"]) {
    const allTriggers = Object.entries(attributes).reduce((acc: string[], [k, v]) => {
      if (k.match(/Trigger \d+ Details/)) {
        acc.push(v as string)
      }
      return acc
    }, [])
    allTriggers.sort().forEach((t, i) => (attributes[`Trigger ${i + 1} Details`] = t))
  }
  if (attributes["Error 1 Details"]) {
    const allTriggers = Object.entries(attributes).reduce((acc: string[], [k, v]) => {
      if (k.match(/Error \d+ Details/)) {
        acc.push(v as string)
      }
      return acc
    }, [])
    allTriggers.sort().forEach((t, i) => (attributes[`Error ${i + 1} Details`] = t))
  }
  Object.entries(attributes).forEach(([k, v]) => {
    if (k.match(/Error \d+ Details/) || k.match(/Offence \d+ Details/)) {
      attributes[k] = (v as string).split("||")[0]
    }
  })

  return attributes
}

const normaliseAttributes = (attributes?: KeyValuePair<string, unknown>): KeyValuePair<string, unknown> => {
  const attributesToNormalise = [
    "Exception Type",
    "PNC Request Message",
    "PNC Request Type",
    "PNC Response Message",
    "PNC Response Time",
    "Trigger and Exception Flag"
  ]
  if (!attributes) {
    return {}
  }
  attributesToNormalise.forEach((attr) => {
    if (attributes[attr] !== undefined) {
      attributes[attr] = "normalised"
    }
  })

  return normaliseAttributeDetails(attributes)
}

const normaliseAuditLogs = (logs: AuditLogEvent[]): Partial<AuditLogEvent>[] =>
  logs
    .map((log) => ({
      eventCode: log.eventCode,
      eventType: log.eventType,
      category: log.category,
      attributes: normaliseAttributes(log.attributes)
    }))
    .sort((a, b) => a.eventCode.localeCompare(b.eventCode))

const convertXmlAuditLogs = (logs: string[]): AuditLogEvent[] => {
  return logs.map((logXml) => {
    const parser = new XMLParser()
    const rawParsedObj = parser.parse(logXml)

    const timestamp = rawParsedObj.logEvent.eventDateTime
    const category = rawParsedObj.logEvent.eventCategory
    const eventType = rawParsedObj.logEvent.eventType
    const eventSource = rawParsedObj.logEvent.componentID
    const attributes = rawParsedObj.logEvent.nameValuePairs.nameValuePair.reduce(
      (acc: KeyValuePair<string, string>, nvp: { name: string; value: string }) => {
        acc[nvp.name] = nvp.value
        if (nvp.name === "Force Owner") {
          acc[nvp.name] = String(nvp.value).padStart(6, "0")
        }
        return acc
      },
      {}
    )
    const eventCode = attributes.eventCode
    delete attributes.eventCode
    const user = attributes.user ? { user: attributes.user } : {}
    delete attributes.user
    delete attributes.auditLogVersion

    return { timestamp, category, eventCode, eventType, eventSource, attributes, ...user } as any as AuditLogEvent
  })
}

const checkDatabaseMatches = async (expected: any): Promise<void> => {
  const errorList = await sql<ErrorListRecord[]>`select * from BR7OWN.ERROR_LIST`
  const errorListTriggers = await sql<ErrorListTriggerRecord[]>`select * from BR7OWN.ERROR_LIST_TRIGGERS`
  const expectedTriggers = errorListTriggers.map((trigger) => trigger.trigger_code)

  expect(errorList).toHaveLength(expected.errorList.length)
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
    expect(errorList[0].error_report).toEqual(expected.errorList[0].error_report)
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

  expect(errorListTriggers).toHaveLength(expected.errorListTriggers.length)
  expect(normaliseTriggers(errorListTriggers)).toStrictEqual(normaliseTriggers(expected.errorListTriggers))
}

const filePath = "test-data/e2e-comparison"
const ignored = [
  "034",
  "075",
  "083",
  "142",
  "190",
  "271",
  "312",
  "313",
  "400",
  "402",
  "403",
  "404",
  "405",
  "406",
  "408"
]

let tests = fs
  .readdirSync(filePath)
  .map((name) => `${filePath}/${name}`)
  .map(processTestFile) as OldPhase1Comparison[]

const filter = process.env.FILTER_TEST
tests = tests.filter((t) => t.dbContent !== undefined && t.auditLogEvents !== undefined)
const totalChunks = process.env.CIRCLE_NODE_TOTAL ? Number(process.env.CIRCLE_NODE_TOTAL) : null
const currentChunk = process.env.CIRCLE_NODE_INDEX ? Number(process.env.CIRCLE_NODE_INDEX) : null

if (filter) {
  tests = tests.filter((t) => t.file && t.file.includes(`test-${filter}`))
} else {
  tests = tests.filter((t) => !ignored.some((i) => t.file && t.file.includes(`test-${i}`)))
}

if (totalChunks !== null) {
  tests = tests.filter((_, i) => i % totalChunks === currentChunk)
}

describe("phase1", () => {
  let s3Server: MockS3
  let client: S3Client
  let pncApi: MockServer
  let auditLogApi: MockServer
  let mockAuditLog: jest.Mock

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
    await s3Server.start()
    client = new S3Client(s3Config)

    pncApi = new MockServer({ port: 11000 })
    await pncApi.start()

    auditLogApi = new MockServer({ port: 11001 })
    await auditLogApi.start()

    process.env.PHASE_1_BUCKET_NAME = bucket
  })

  afterAll(async () => {
    await s3Server.stop()
    await client.destroy()
    await pncApi.stop()
    await auditLogApi.stop()
    await testMqGateway.dispose()
  })

  beforeEach(async () => {
    await testMqGateway.getMessages(phase2Queue, 1)
    await sql`DELETE FROM br7own.error_list`
    mockAuditLog = auditLogApi.post("/messages/:id/events").mockImplementationOnce((ctx) => (ctx.status = 204))
  })

  it.each(tests)("should correctly process $file", async (comparison: ImportedComparison) => {
    const asn = extractAsnFromAhoXml(comparison.incomingMessage)
    const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
    const hasExceptions = extractExceptionsFromAho(comparison.annotatedHearingOutcome).length > 0
    const isIgnored = comparison.auditLogEvents?.some((event) => event.match(/hearing-outcome\.ignored/))

    const s3Path = "comparison.xml"
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

    let thrown = false
    try {
      MockDate.set(pncQueryDate)
      await phase1(s3Path)
      MockDate.reset()
    } catch (e) {
      thrown = true
    }
    expect(thrown).toBeFalsy()

    // Check the database
    await checkDatabaseMatches(comparison.dbContent)

    // Check the audit logs
    const generatedAuditLogs = mockAuditLog.mock.calls[0][0].request.body
    const expectedAuditLogs = convertXmlAuditLogs(comparison.auditLogEvents!)
    expect(normaliseAuditLogs(generatedAuditLogs)).toStrictEqual(normaliseAuditLogs(expectedAuditLogs))

    // Check the Phase 2 message queue
    const shouldGoToMessageQueue = !hasExceptions && !isIgnored

    if (shouldGoToMessageQueue) {
      const message = await testMqGateway.getMessage(phase2Queue)
      expect(message).not.toBeNull()
      expect(message).toEqualXML(comparison.annotatedHearingOutcome)
    } else {
      const message = await testMqGateway.getMessage(phase2Queue, 100)
      expect(message).toBeNull()
    }
  })
})
