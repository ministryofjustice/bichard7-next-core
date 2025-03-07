import "jest-xml-matcher"

import "../tests/helpers/setEnvironmentVariables"

import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import "jest-xml-matcher"

import type { ParseIncomingMessageResult } from "../comparison/lib/parseIncomingMessage"
import type { Phase2E2eComparison } from "../comparison/types/ComparisonFile"
import type ErrorListRecord from "../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../types/ErrorListTriggerRecord"
import type Phase2Result from "./types/Phase2Result"

import parseIncomingMessage from "../comparison/lib/parseIncomingMessage"
import processTestFile from "../comparison/lib/processTestFile"
import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import saveErrorListRecord from "../lib/database/saveErrorListRecord"
import serialiseToXml from "../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import {
  clearDatabase,
  disconnectDb,
  insertRecords,
  normaliseTriggers,
  sortTriggers,
  sql
} from "../tests/helpers/e2eComparisonTestsHelpers"
import phase2 from "./phase2"
import { Phase2ResultType } from "./types/Phase2Result"

const normaliseAttributeDetails = (attributes: Record<string, unknown>): Record<string, unknown> => {
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

const normaliseAttributes = (attributes?: Record<string, unknown>): Record<string, unknown> => {
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
    .filter(
      (log) =>
        ![
          "exceptions.generated",
          "hearing-outcome.ignored.results-already-on-pnc",
          "hearing-outcome.received-phase-2",
          "hearing-outcome.submitted-phase-3",
          "triggers.generated"
        ].includes(log.eventCode)
    )

const convertXmlAuditLogs = (logs: string[]): AuditLogEvent[] => {
  return logs.map((logXml) => {
    const parser = new XMLParser()
    const rawParsedObj = parser.parse(logXml)

    const timestamp = rawParsedObj.logEvent.eventDateTime
    const category = rawParsedObj.logEvent.eventCategory
    const eventType = rawParsedObj.logEvent.eventType
    const eventSource = rawParsedObj.logEvent.componentID
    const attributes = rawParsedObj.logEvent.nameValuePairs.nameValuePair.reduce(
      (acc: Record<string, string>, nvp: { name: string; value: string }) => {
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

const filePath = "phase2/tests/fixtures/e2e-comparison"
const ignored: string[] = []

const filter = process.env.FILTER_TEST

const tests = fs
  .readdirSync(filePath)
  .filter((name) => {
    if (filter) {
      return name.includes(`test-${filter}`)
    } else {
      return !ignored.some((i) => name.includes(`test-${i}`))
    }
  })
  .map((name) => `${filePath}/${name}`)
  .map(processTestFile) as Phase2E2eComparison[]

describe("phase2", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  describe.each(tests)("should correctly process $file", (comparison: Phase2E2eComparison) => {
    let phase2Result: Phase2Result
    let parsedOutgoingMessage: ParseIncomingMessageResult

    beforeEach(() => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const parsedIncomingMessage = parseIncomingMessage(comparison.incomingMessage)
      parsedOutgoingMessage = parseIncomingMessage(comparison.outgoingMessage)
      if (parsedIncomingMessage.type === "SPIResults") {
        throw new Error("Incorrect type found for incoming message")
      }

      phase2Result = phase2(parsedIncomingMessage.message, auditLogger)
    })

    it("should generate the correct xml", () => {
      const expectedOutput = comparison.outgoingMessage
      const actualOutput = serialiseToXml(phase2Result.outputMessage, true)
      expect(actualOutput).toEqualXML(expectedOutput)
    })

    it("should generate the correct triggers", () => {
      const expectedTriggers = sortTriggers(comparison.triggers)
      const actualTriggers = sortTriggers(phase2Result.triggers)
      expect(actualTriggers).toStrictEqual(expectedTriggers)
    })

    it("should generate the correct exceptions", () => {
      const expectedExceptions = parsedOutgoingMessage.message.Exceptions
      const actualExceptions = phase2Result.outputMessage.Exceptions
      expect(actualExceptions).toStrictEqual(expectedExceptions)
    })

    it("should store the data correctly in the database", async () => {
      await insertRecords(comparison.db.before)

      const shouldPersist =
        phase2Result.triggerGenerationAttempted ||
        phase2Result.outputMessage.Exceptions.length > 0 ||
        phase2Result.resultType === Phase2ResultType.ignored

      if (shouldPersist) {
        await saveErrorListRecord(sql, phase2Result)
      }

      await checkDatabaseMatches(comparison.db.after)
    })

    it("should generate the correct audit logs", () => {
      const expectedAuditLogs = normaliseAuditLogs(convertXmlAuditLogs(comparison.auditLogEvents))
      const actualAuditLogs = normaliseAuditLogs(phase2Result.auditLogEvents)
      expect(actualAuditLogs).toStrictEqual(expectedAuditLogs)
    })
  })
})
