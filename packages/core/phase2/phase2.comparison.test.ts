import "jest-xml-matcher"

import "../tests/helpers/setEnvironmentVariables"

import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import "jest-xml-matcher"

import type { ParseIncomingMessageResult } from "../tests/helpers/comparison/parseIncomingMessage"
import type { Phase2E2eComparison } from "../tests/types/ComparisonFile"
import type Phase2Result from "./types/Phase2Result"

import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import saveErrorListRecord from "../lib/database/saveErrorListRecord"
import serialiseToXml from "../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import checkDatabaseMatches from "../tests/helpers/comparison/checkDatabaseMatches"
import convertXmlAuditLogs from "../tests/helpers/comparison/convertXmlAuditLogs"
import {
  clearDatabase,
  disconnectDb,
  insertRecords,
  sortTriggers,
  sql
} from "../tests/helpers/comparison/e2eComparisonTestsHelpers"
import getComparisonTests from "../tests/helpers/comparison/getComparisonTests"
import parseIncomingMessage from "../tests/helpers/comparison/parseIncomingMessage"
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
    const allErrorDetails = Object.entries(attributes).reduce((acc: string[], [k, v]) => {
      if (k.match(/Error \d+ Details/)) {
        acc.push(v as string)
      }

      return acc
    }, [])
    allErrorDetails.sort().forEach((t, i) => (attributes[`Error ${i + 1} Details`] = t))
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

describe("phase2", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  const tests = getComparisonTests<Phase2E2eComparison>(2)

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

    // eslint-disable-next-line jest/expect-expect
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
