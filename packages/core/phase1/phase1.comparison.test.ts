import "jest-xml-matcher"

import "./tests/helpers/setEnvironmentVariables"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import "jest-xml-matcher"

import type { OldPhase1Comparison } from "../comparison/types/ComparisonFile"
import type ErrorListRecord from "../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../types/ErrorListTriggerRecord"
import type Exception from "../types/Exception"
import type Phase1Result from "./types/Phase1Result"

import generateMockPncQueryResultFromAho from "../comparison/lib/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../comparison/lib/getPncQueryTimeFromAho"
import MockPncGateway from "../comparison/lib/MockPncGateway"
import parseIncomingMessage from "../comparison/lib/parseIncomingMessage"
import { sortExceptions } from "../comparison/lib/sortExceptions"
import { matchingExceptions } from "../comparison/lib/summariseMatching"
import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import saveErrorListRecord from "../lib/database/saveErrorListRecord"
import { extractExceptionsFromXml } from "../lib/parse/parseAhoXml"
import serialiseToXml from "../lib/serialise/ahoXml/serialiseToXml"
import getComparisonTests from "../tests/helpers/comparison/getComparisonTests"
import { clearDatabase, disconnectDb, sortTriggers, sql } from "../tests/helpers/e2eComparisonTestsHelpers"
import phase1 from "./phase1"

const checkDatabaseMatches = async (expected: any): Promise<void> => {
  const errorList = await sql<ErrorListRecord[]>`select * from BR7OWN.ERROR_LIST`
  const errorListTriggers = await sql<ErrorListTriggerRecord[]>`select * from BR7OWN.ERROR_LIST_TRIGGERS`
  const expectedTriggers = errorListTriggers.map((trigger) => trigger.trigger_code)

  if (expected.errorList.length === 0 && expected.errorListTriggers.length == 0) {
    expect(errorList).toHaveLength(0)
    expect(errorListTriggers).toHaveLength(0)
    return
  }

  expect(errorList).toHaveLength(expected.errorList.length)
  const expectedError = expected.errorList[0]

  expect(errorList[0].message_id).toEqual(expectedError.message_id)
  expect(errorList[0].phase).toEqual(expectedError.phase)
  expect(errorList[0].error_status).toEqual(expectedError.error_status)
  expect(errorList[0].trigger_status).toEqual(expectedError.trigger_status)
  expect(errorList[0].error_quality_checked).toEqual(expectedError.error_quality_checked)
  expect(errorList[0].trigger_quality_checked).toEqual(expectedError.trigger_quality_checked)
  expect(errorList[0].trigger_count).toEqual(expectedError.trigger_count)
  expect(errorList[0].is_urgent).toEqual(expectedError.is_urgent)
  expect(errorList[0].asn).toEqual(expectedError.asn)
  expect(errorList[0].court_code).toEqual(expectedError.court_code)
  expect(errorList[0].annotated_msg).toEqualXML(expectedError.annotated_msg)
  expect(errorList[0].updated_msg).toEqualXML(expectedError.updated_msg)
  expect(errorList[0].error_report).toEqual(expectedError.error_report)
  expect(errorList[0].create_ts).toBeDefined()
  expect(errorList[0].error_reason).toEqual(expectedError.error_reason)

  if (expectedError.trigger_reason) {
    expect(expectedTriggers).toContain(errorList[0].trigger_reason)
  } else {
    expect(errorList[0].trigger_reason).toBeNull()
  }

  expect(errorList[0].error_count).toEqual(expectedError.error_count)
  expect(errorList[0].court_date).toEqual(expectedError.court_date)
  expect(errorList[0].ptiurn).toEqual(expectedError.ptiurn)
  expect(errorList[0].court_name).toEqual(expectedError.court_name)
  expect(errorList[0].msg_received_ts).toBeDefined()
  expect(errorList[0].trigger_resolved_ts).toEqual(expectedError.trigger_resolved_ts)
  expect(errorList[0].defendant_name).toEqual(expectedError.defendant_name)
  expect(errorList[0].org_for_police_filter).toEqual(expectedError.org_for_police_filter)
  expect(errorList[0].court_room).toEqual(expectedError.court_room)
  expect(errorList[0].court_reference).toEqual(expectedError.court_reference)
  expect(errorList[0].error_insert_ts).toBeDefined()
  expect(errorList[0].trigger_insert_ts).toBeDefined()
  expect(errorList[0].pnc_update_enabled).toEqual(expectedError.pnc_update_enabled)

  expect(errorListTriggers).toHaveLength(expected.errorListTriggers.length)
}

describe("phase1", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  const ignored = ["108-1", "295-1"]
  const tests = getComparisonTests<OldPhase1Comparison>(1, ignored)

  describe.each(tests)("should correctly process $file", (comparison: OldPhase1Comparison) => {
    let phase1Result: Phase1Result
    let exceptionsFromAho: Exception[]
    let exceptionsFromCore: Exception[]
    let ignoreNewMatcherXmlDifferences: boolean

    beforeEach(async () => {
      await clearDatabase()

      const normalisedAho = comparison.annotatedHearingOutcome.replace(/ WeedFlag="[^"]*"/g, "")
      const pncQuery = generateMockPncQueryResultFromAho(normalisedAho)
      const pncQueryTime = getPncQueryTimeFromAho(normalisedAho)
      const mockPncGateway = new MockPncGateway(pncQuery, pncQueryTime)

      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
      const { message: hearingOutcome } = parseIncomingMessage(comparison.incomingMessage)

      phase1Result = await phase1(hearingOutcome, mockPncGateway, auditLogger)

      exceptionsFromCore = sortExceptions(phase1Result.hearingOutcome.Exceptions ?? [])
      exceptionsFromAho = sortExceptions(extractExceptionsFromXml(normalisedAho))

      ignoreNewMatcherXmlDifferences =
        exceptionsFromCore.some((e) => matchingExceptions.includes(e.code)) &&
        exceptionsFromCore.every(
          (e) => !matchingExceptions.includes(e.code) || exceptionsFromAho.map((ex) => ex.code).includes(e.code)
        )
    })

    it("should generate the correct xml", () => {
      if (ignoreNewMatcherXmlDifferences) {
        return
      }

      const expectedOutput = comparison.annotatedHearingOutcome
      const actualOutput = serialiseToXml(phase1Result.hearingOutcome)

      expect(actualOutput).toEqualXML(expectedOutput)
    })

    it("should generate the correct triggers", () => {
      const ignoreNewMatcherTrigger18Differences =
        comparison.triggers.some((t) => t.code === TriggerCode.TRPR0018) &&
        exceptionsFromAho.some((e) => matchingExceptions.includes(e.code))

      if (ignoreNewMatcherTrigger18Differences) {
        return
      }

      const expectedTriggers = sortTriggers(comparison.triggers)
      const actualTriggers = sortTriggers(phase1Result.triggers)

      expect(actualTriggers).toStrictEqual(expectedTriggers)
    })

    it("should generate the correct exceptions", () => {
      if (ignoreNewMatcherXmlDifferences) {
        return
      }

      expect(exceptionsFromCore).toStrictEqual(exceptionsFromAho)
    })

    // eslint-disable-next-line jest/expect-expect
    it("should store the data correctly in the database", async () => {
      if (ignoreNewMatcherXmlDifferences || !comparison.dbContent) {
        return
      }

      await saveErrorListRecord(sql, phase1Result)

      await checkDatabaseMatches(comparison.dbContent)
    })
  })
})
