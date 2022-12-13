jest.setTimeout(99999999)
import "tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import orderBy from "lodash.orderby"
import MockDate from "mockdate"
import postgres from "postgres"
import type { ImportedComparison } from "src/comparison/types/ImportedComparison"
import createDbConfig from "src/lib/createDbConfig"
import createS3Config from "src/lib/createS3Config"
import { createMqConfig, TestMqGateway } from "src/lib/MqGateway"
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
    await testMqGateway.getMessages(phase2Queue)
    await sql`DELETE FROM br7own.error_list`
    mockAuditLog = auditLogApi.post("/messages/:id/events").mockImplementationOnce((ctx) => (ctx.status = 204))
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

      await phase1(s3Path)

      // Check the database
      await checkDatabaseMatches(comparison.dbContent)

      // Check the audit logs
      const generatedAuditLogs = mockAuditLog.mock.calls[0][0].request.body
      const expectedAuditLogs = convertXmlAuditLogs(comparison.auditLogEvents!)
      expect(normaliseAuditLogs(generatedAuditLogs)).toStrictEqual(normaliseAuditLogs(expectedAuditLogs))

      // Check the Phase 2 message queue
      const message = await testMqGateway.getMessage(phase2Queue)
      expect(message).toEqualXML(comparison.annotatedHearingOutcome)
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

    await phase1(s3Path)

    // Check the database
    await checkDatabaseMatches(comparison.dbContent)

    // Check the audit logs
    const generatedAuditLogs = mockAuditLog.mock.calls[0][0].request.body
    const expectedAuditLogs = convertXmlAuditLogs(comparison.auditLogEvents!)
    expect(normaliseAuditLogs(generatedAuditLogs)).toStrictEqual(normaliseAuditLogs(expectedAuditLogs))

    // Check the Phase 2 message queue
    const message = await testMqGateway.getMessage(phase2Queue)
    expect(message).toEqualXML(comparison.annotatedHearingOutcome)
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

    await phase1(s3Path)

    // Check the database
    await checkDatabaseMatches(comparison.dbContent)

    // Check the audit logs
    const generatedAuditLogs = mockAuditLog.mock.calls[0][0].request.body
    const expectedAuditLogs = convertXmlAuditLogs(comparison.auditLogEvents!)
    expect(normaliseAuditLogs(generatedAuditLogs)).toStrictEqual(normaliseAuditLogs(expectedAuditLogs))

    // Check the Phase 2 message queue
    const message = await testMqGateway.getMessage(phase2Queue)
    expect(message).toBeNull()
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

    await phase1(s3Path)

    // Check the database
    await checkDatabaseMatches(comparison.dbContent)

    // Check the audit logs
    const generatedAuditLogs = mockAuditLog.mock.calls[0][0].request.body
    const expectedAuditLogs = convertXmlAuditLogs(comparison.auditLogEvents!)
    expect(normaliseAuditLogs(generatedAuditLogs)).toStrictEqual(normaliseAuditLogs(expectedAuditLogs))

    // Check the Phase 2 message queue
    const message = await testMqGateway.getMessage(phase2Queue)
    expect(message).toBeNull()
  })

  it.each(["test-data/e2e-comparison/test-146.json"])(
    "should correctly process an input message that is ignored for %s",
    async (file: string) => {
      const comparison = processTestFile(file)
      const asn = extractAsnFromAhoXml(comparison.incomingMessage)
      const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
      MockDate.set(pncQueryDate)

      const s3Path = "ignored.xml"
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

      await phase1(s3Path)

      // Check the database
      await checkDatabaseMatches(comparison.dbContent)

      // Check the audit logs
      const generatedAuditLogs = mockAuditLog.mock.calls[0][0].request.body
      const expectedAuditLogs = convertXmlAuditLogs(comparison.auditLogEvents!)
      expect(normaliseAuditLogs(generatedAuditLogs)).toStrictEqual(normaliseAuditLogs(expectedAuditLogs))

      // Check the Phase 2 message queue
      const message = await testMqGateway.getMessage(phase2Queue)
      expect(message).toBeNull()
    }
  )
})
