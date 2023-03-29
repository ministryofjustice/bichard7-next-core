import fs from "fs"
import "jest-xml-matcher"
import { isError } from "src/comparison/types"
import type { Phase1Comparison } from "src/comparison/types/ComparisonFile"
import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import CoreHandler from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import { parseAhoXml } from "src/parse/parseAhoXml"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import generateMockPncQueryResultFromAho from "./helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "./helpers/getPncQueryTimeFromAho"
import MockPncGateway from "./helpers/MockPncGateway"
import processTestFile from "./helpers/processTestFile"

const filePath = "test-data/e2e-comparison"

const matchingExceptions: ExceptionCode[] = [
  ExceptionCode.HO100304,
  ExceptionCode.HO100310,
  ExceptionCode.HO100311,
  ExceptionCode.HO100312,
  ExceptionCode.HO100320,
  ExceptionCode.HO100328,
  ExceptionCode.HO100329,
  ExceptionCode.HO100332,
  ExceptionCode.HO100333
]

const hasMatch = (aho: AnnotatedHearingOutcome): boolean => {
  const hasCaseRef = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const hasOffenceRef = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (o) => !!o.CourtCaseReferenceNumber
  )
  return hasCaseRef || hasOffenceRef
}

const parseOffenceReasonSequence = (input: string | null | undefined): number | undefined => {
  if (!input) {
    return undefined
  }
  return Number(input)
}

const summariseMatching = (aho: AnnotatedHearingOutcome): CourtResultMatchingSummary | null => {
  const matchingExceptionsGenerated = aho.Exceptions.filter((e) => matchingExceptions.includes(e.code))
  if (matchingExceptionsGenerated.length > 0) {
    return null
  }
  if (!hasMatch(aho)) {
    return null
  }
  return {
    ...(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
      ? { courtCaseReference: aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber }
      : {}),
    defendant: {
      offences: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => ({
        hoSequenceNumber: offence.CourtOffenceSequenceNumber,
        ...(offence.CourtCaseReferenceNumber ? { courtCaseReference: offence.CourtCaseReferenceNumber } : {}),
        addedByCourt: !!offence.AddedByTheCourt,
        pncSequenceNumber: parseOffenceReasonSequence(offence.CriminalProsecutionReference.OffenceReasonSequence)
      }))
    }
  }
}
const filter = process.env.FILTER_TEST

const tests = fs
  .readdirSync(filePath)
  .map((name) => `${filePath}/${name}`)
  .filter((name) => !filter || name.includes(filter))
  .map(processTestFile) as Phase1Comparison[]

describe("Comparison testing", () => {
  describe.each(tests)("for test file $file", ({ incomingMessage, annotatedHearingOutcome }) => {
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
})
