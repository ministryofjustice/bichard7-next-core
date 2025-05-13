import "jest-xml-matcher"

import "./tests/helpers/setEnvironmentVariables"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import "jest-xml-matcher"

import type { OldPhase1Comparison } from "../tests/types/ComparisonFile"
import type Exception from "../types/Exception"
import type Phase1Result from "./types/Phase1Result"

import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import saveErrorListRecord from "../lib/database/saveErrorListRecord"
import { extractExceptionsFromXml } from "../lib/parse/parseAhoXml"
import serialiseToXml from "../lib/serialise/ahoXml/serialiseToXml"
import checkDatabaseMatches from "../tests/helpers/comparison/checkDatabaseMatches"
import { clearDatabase, disconnectDb, sql } from "../tests/helpers/comparison/ComparisonTestDbHelpers"
import generateMockPncQueryResultFromAho from "../tests/helpers/comparison/generateMockPncQueryResultFromAho"
import getComparisonTests from "../tests/helpers/comparison/getComparisonTests"
import getPncQueryTimeFromAho from "../tests/helpers/comparison/getPncQueryTimeFromAho"
import parseIncomingMessage from "../tests/helpers/comparison/parseIncomingMessage"
import { matchingExceptions } from "../tests/helpers/comparison/summariseMatching"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import sortExceptions from "../tests/helpers/sortExceptions"
import sortTriggers from "../tests/helpers/sortTriggers"
import phase1 from "./phase1"

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
