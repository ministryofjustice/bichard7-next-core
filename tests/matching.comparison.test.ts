import fs from "fs"
import "jest-xml-matcher"
import { isError } from "src/comparison/types"
import type { Phase1Comparison } from "src/comparison/types/ComparisonFile"
import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import CoreHandler from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import { parseAhoXml } from "src/parse/parseAhoXml"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import generateMockPncQueryResultFromAho from "./helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "./helpers/getPncQueryTimeFromAho"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"
import summariseMatching, { matchingExceptions } from "./helpers/summariseMatching"

const filePath = "test-data/e2e-comparison"

const filter = process.env.FILTER_TEST

const allTests = fs
  .readdirSync(filePath)
  .filter((name) => name.endsWith(".json"))
  .map((name) => `${filePath}/${name}`)
  .filter((name) => !filter || name.includes(filter))
  .map(processTestFile) as Phase1Comparison[]

const parseAho = (aho: string): [AnnotatedHearingOutcome, CourtResultMatchingSummary | null] => {
  const expectedAho = parseAhoXml(aho)
  if (isError(expectedAho)) {
    throw expectedAho
  }
  const expectedMatch = summariseMatching(expectedAho)
  return [expectedAho, expectedMatch]
}

// Filter out the tests that don't involve a pnc query
const pncQueryTests = allTests.filter((test) => {
  const [expectedAho] = parseAho(test.annotatedHearingOutcome)
  return !!expectedAho.PncQuery
})

// Select the tests that match perfectly
const perfectlyMatchingTests = pncQueryTests.filter((test) => {
  const [expectedAho, expectedMatch] = parseAho(test.annotatedHearingOutcome)
  return (
    expectedMatch &&
    expectedMatch.courtCaseReference &&
    !expectedMatch.offences.some((o) => o.addedByCourt) &&
    expectedMatch.offences.every((o) => o.hoSequenceNumber === o.pncSequenceNumber) &&
    expectedAho.PncQuery?.courtCases?.length === 1
  )
})
let remainingTests = pncQueryTests.filter((t) => !perfectlyMatchingTests.includes(t))

// Select the tests where the court added an offence
const addedByCourtTests = remainingTests.filter((test) => {
  const [expectedAho, expectedMatch] = parseAho(test.annotatedHearingOutcome)
  return (
    expectedMatch &&
    expectedMatch.courtCaseReference &&
    expectedMatch.offences.every((o) => o.hoSequenceNumber === o.pncSequenceNumber || o.addedByCourt) &&
    expectedAho.PncQuery?.courtCases?.length === 1
  )
})
remainingTests = remainingTests.filter((t) => !addedByCourtTests.includes(t))

// Select the tests where exceptions were raised
const exceptionTests = remainingTests.filter((test) => {
  const [expectedAho] = parseAho(test.annotatedHearingOutcome)
  const matchingExceptionsGenerated = expectedAho.Exceptions.filter((e) => matchingExceptions.includes(e.code))
  return matchingExceptionsGenerated.length > 0
})
remainingTests = remainingTests.filter((t) => !exceptionTests.includes(t))

// Select the tests where multiple court cases were matched
const multipleCourtCaseTests = remainingTests.filter((test) => {
  const [expectedAho, expectedMatch] = parseAho(test.annotatedHearingOutcome)
  return (
    expectedMatch &&
    !expectedMatch.courtCaseReference &&
    expectedMatch.offences.every(
      (o) => (o.hoSequenceNumber && o.pncSequenceNumber && o.courtCaseReference) || o.addedByCourt
    ) &&
    expectedAho.PncQuery?.courtCases &&
    expectedAho.PncQuery.courtCases.length > 1
  )
})
remainingTests = remainingTests.filter((t) => !multipleCourtCaseTests.includes(t))

const testGroups = [
  { description: "perfectly matching", tests: perfectlyMatchingTests },
  { description: "added by court", tests: addedByCourtTests },
  { description: "exceptions generated", tests: exceptionTests },
  { description: "multiple court cases", tests: multipleCourtCaseTests },
  { description: "remaining tests", tests: remainingTests }
].filter((g) => g.tests.length > 0)

describe("Comparison testing", () => {
  describe.each(testGroups)("$description", ({ tests }) => {
    if (tests.length > 0) {
      describe.each(tests)("for file $file", ({ incomingMessage, annotatedHearingOutcome }) => {
        describe("matching court results to the PNC", () => {
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
})
