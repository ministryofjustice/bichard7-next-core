import fs from "fs"
import "jest-xml-matcher"
import { isError } from "src/comparison/types"
import type { Phase1Comparison } from "src/comparison/types/ComparisonFile"
import CoreHandler from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import { parseAhoXml } from "src/parse/parseAhoXml"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import generateMockPncQueryResultFromAho from "./helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "./helpers/getPncQueryTimeFromAho"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"
import summariseMatching from "./helpers/summariseMatching"

const filePath = "test-data/e2e-comparison"

const filter = process.env.FILTER_TEST

const tests = fs
  .readdirSync(filePath)
  .filter((name) => name.endsWith(".json"))
  .map((name) => `${filePath}/${name}`)
  .filter((name) => !filter || name.includes(filter))
  .map(processTestFile) as Phase1Comparison[]

const perfectlyMatchingTests = tests.filter((test) => {
  const expectedAho = parseAhoXml(test.annotatedHearingOutcome)
  if (isError(expectedAho)) {
    return false
  }
  const expectedMatch = summariseMatching(expectedAho)
  if (expectedMatch === null) {
    return false
  }

  return (
    expectedMatch.courtCaseReference &&
    !expectedMatch.offences.some((o) => o.addedByCourt) &&
    expectedMatch.offences.every((o) => o.hoSequenceNumber === o.pncSequenceNumber) &&
    expectedAho.PncQuery?.courtCases?.length === 1
  )
})

const addedByCourtTests = tests
  .filter((t) => !perfectlyMatchingTests.includes(t))
  .filter((test) => {
    const expectedAho = parseAhoXml(test.annotatedHearingOutcome)
    if (isError(expectedAho)) {
      return false
    }
    const expectedMatch = summariseMatching(expectedAho)
    if (expectedMatch === null) {
      return false
    }

    return (
      expectedMatch.courtCaseReference &&
      expectedMatch.offences.every((o) => o.hoSequenceNumber === o.pncSequenceNumber || o.addedByCourt) &&
      expectedAho.PncQuery?.courtCases?.length === 1
    )
  })

const remainingTests = tests.filter((t) => !perfectlyMatchingTests.includes(t) && !addedByCourtTests.includes(t))

describe("Comparison testing", () => {
  if (perfectlyMatchingTests.length > 0) {
    describe.each(perfectlyMatchingTests)(
      "for perfectly matching test file $file",
      ({ incomingMessage, annotatedHearingOutcome }) => {
        describe("processing spi messages", () => {
          let coreResult: Phase1SuccessResult

          beforeEach(async () => {
            const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
            const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
            const pncGateway = new MockPncGateway(response, pncQueryTime)
            const auditLogger = new CoreAuditLogger()
            coreResult = (await CoreHandler(incomingMessage, pncGateway, auditLogger)) as Phase1SuccessResult
          })

          it("should correctly match pnc offences", () => {
            const expectedAho = parseAhoXml(annotatedHearingOutcome)
            if (isError(expectedAho)) {
              throw expectedAho as Error
            }
            const expectedMatch = summariseMatching(expectedAho)
            const actualMatch = summariseMatching(coreResult.hearingOutcome)
            expect(actualMatch).toStrictEqual(expectedMatch)
          })
        })
      }
    )
  }

  if (addedByCourtTests.length > 0) {
    describe.each(addedByCourtTests)(
      "for cases with offences added by court but otherwise matching test file $file",
      ({ incomingMessage, annotatedHearingOutcome }) => {
        describe("processing spi messages", () => {
          let coreResult: Phase1SuccessResult

          beforeEach(async () => {
            const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
            const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
            const pncGateway = new MockPncGateway(response, pncQueryTime)
            const auditLogger = new CoreAuditLogger()
            coreResult = (await CoreHandler(incomingMessage, pncGateway, auditLogger)) as Phase1SuccessResult
          })

          it("should correctly match pnc offences", () => {
            const expectedAho = parseAhoXml(annotatedHearingOutcome)
            if (isError(expectedAho)) {
              throw expectedAho as Error
            }
            const expectedMatch = summariseMatching(expectedAho)
            const actualMatch = summariseMatching(coreResult.hearingOutcome)
            expect(actualMatch).toStrictEqual(expectedMatch)
          })
        })
      }
    )
  }

  if (remainingTests.length > 0) {
    describe.each(remainingTests)("for remaining test file $file", ({ incomingMessage, annotatedHearingOutcome }) => {
      describe("processing spi messages", () => {
        let coreResult: Phase1SuccessResult

        beforeEach(async () => {
          const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
          const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
          const pncGateway = new MockPncGateway(response, pncQueryTime)
          const auditLogger = new CoreAuditLogger()
          coreResult = (await CoreHandler(incomingMessage, pncGateway, auditLogger)) as Phase1SuccessResult
        })

        it("should correctly match pnc offences", () => {
          const expectedAho = parseAhoXml(annotatedHearingOutcome)
          if (isError(expectedAho)) {
            throw expectedAho as Error
          }
          const expectedMatch = summariseMatching(expectedAho)
          const actualMatch = summariseMatching(coreResult.hearingOutcome)
          expect(actualMatch).toStrictEqual(expectedMatch)
        })
      })
    })
  }
})
