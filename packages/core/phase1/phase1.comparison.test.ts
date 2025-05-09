import "jest-xml-matcher"

import "./tests/helpers/setEnvironmentVariables"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import "jest-xml-matcher"
import fs from "fs"

import type { OldPhase1Comparison, Phase1Comparison } from "../comparison/types/ComparisonFile"
import type Phase1Result from "./types/Phase1Result"

import generateMockPncQueryResultFromAho from "../comparison/lib/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../comparison/lib/getPncQueryTimeFromAho"
import MockPncGateway from "../comparison/lib/MockPncGateway"
import parseIncomingMessage from "../comparison/lib/parseIncomingMessage"
import processTestFile from "../comparison/lib/processTestFile"
import { sortExceptions } from "../comparison/lib/sortExceptions"
import { matchingExceptions } from "../comparison/lib/summariseMatching"
import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import { extractExceptionsFromXml } from "../lib/parse/parseAhoXml"
import serialiseToXml from "../lib/serialise/ahoXml/serialiseToXml"
import { clearDatabase, disconnectDb, sortTriggers } from "../tests/helpers/e2eComparisonTestsHelpers"
import phase1 from "./phase1"

const filePath = "phase1/tests/fixtures/e2e-comparison"
const ignored: string[] = ["108-1", "295-1"]

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
  .map(processTestFile) as Phase1Comparison[]

describe("phase1", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  describe.each(tests)("should correctly process $file", (comparison: OldPhase1Comparison) => {
    let phase1Result: Phase1Result
    let mockPncGateway: MockPncGateway
    let normalisedAho: string
    let ignoreNewMatcherXmlDifferences: boolean

    beforeEach(async () => {
      normalisedAho = comparison.annotatedHearingOutcome.replace(/ WeedFlag="[^"]*"/g, "")
      const pncResponse = generateMockPncQueryResultFromAho(normalisedAho)
      const pncQueryTime = getPncQueryTimeFromAho(normalisedAho)
      mockPncGateway = new MockPncGateway(pncResponse, pncQueryTime)

      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
      const parsedIncomingMessage = parseIncomingMessage(comparison.incomingMessage)

      phase1Result = await phase1(parsedIncomingMessage.message, mockPncGateway, auditLogger)

      const sortedCoreExceptions = sortExceptions(phase1Result.hearingOutcome.Exceptions ?? [])
      const exceptions = extractExceptionsFromXml(normalisedAho)

      ignoreNewMatcherXmlDifferences =
        sortedCoreExceptions.some((e) => matchingExceptions.includes(e.code)) &&
        sortedCoreExceptions.every(
          (e) => !matchingExceptions.includes(e.code) || exceptions.map((ex) => ex.code).includes(e.code)
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
      const exceptions = extractExceptionsFromXml(normalisedAho)

      const ignoreNewMatcherTrigger18Differences =
        comparison.triggers.some((t) => t.code === TriggerCode.TRPR0018) &&
        exceptions.some((e) => matchingExceptions.includes(e.code))

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

      const parsedOutgoingMessage = parseIncomingMessage(comparison.annotatedHearingOutcome)

      const expectedExceptions = sortExceptions(parsedOutgoingMessage.message.Exceptions)
      const actualExceptions = sortExceptions(phase1Result.hearingOutcome.Exceptions)

      expect(actualExceptions).toStrictEqual(expectedExceptions)
    })
  })
})
