/* eslint-disable jest/no-conditional-expect */
import fs from "fs"
import "jest-xml-matcher"
import orderBy from "lodash.orderby"
import createCourtMatchComparison from "src/comparison/lib/createCourtMatchComparison"
import type { CourtResultSummary, PncSummary } from "src/comparison/types/MatchingComparisonOutput"
import type {
  AnnotatedHearingOutcome,
  Case,
  CriminalProsecutionReference,
  HearingDefendant,
  HearingOutcome,
  Offence
} from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import type { PncCourtCase, PncOffence } from "src/types/PncQueryResult"
import enrichCourtCases from "../src/enrichAho/enrichFunctions/enrichCourtCases"

const filePath = "test-data/e2e-comparison"
const filter = process.env.FILTER_TEST

const tests = fs
  .readdirSync(filePath)
  .filter((name) => !filter || name.includes(filter))
  .map((name) => `${filePath}/${name}`)
  .map(createCourtMatchComparison)

const createMockAho = (
  result: CourtResultSummary,
  exceptions: Exception[],
  pncQuery?: PncSummary
): AnnotatedHearingOutcome => {
  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: {
          DateOfHearing: result.dateOfHearing
        },
        Case: {
          HearingDefendant: {
            Offence: result.defendant.offences.map(
              (o) =>
                ({
                  CourtOffenceSequenceNumber: o.sequenceNumber,
                  CriminalProsecutionReference: {
                    OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: o.offenceCode } }
                  } as CriminalProsecutionReference,
                  Result: o.resultCodes.map((r) => ({
                    CJSresultCode: r
                  })),
                  ActualOffenceStartDate: { StartDate: o.startDate },
                  ActualOffenceEndDate: o.endDate ? { EndDate: o.endDate } : undefined
                } as Offence)
            )
          } as HearingDefendant
        } as Case
      } as HearingOutcome
    },
    Exceptions: exceptions,
    PncQuery: pncQuery
      ? {
          courtCases: pncQuery.courtCases?.map(
            (c) =>
              ({
                courtCaseReference: c.reference,
                offences: c.offences.map(
                  (o) =>
                    ({
                      offence: {
                        sequenceNumber: o.sequenceNumber,
                        cjsOffenceCode: o.offenceCode,
                        startDate: o.startDate,
                        endDate: o.endDate
                      }
                    } as PncOffence)
                )
              } as PncCourtCase)
          )
        }
      : undefined
  } as AnnotatedHearingOutcome
}

const parseNumber = (input: string | null | undefined): number | null | undefined => {
  if (input === undefined || input === null) {
    return input
  }
  if (input === "") {
    return undefined
  }
  return Number(input)
}

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])

describe("Comparison testing court case matching", () => {
  describe.each(tests)("for test file $file", ({ courtResult, pnc, matching, exceptions }) => {
    it("should match", () => {
      const aho = createMockAho(courtResult, exceptions, pnc)
      const result = enrichCourtCases(aho)
      if (exceptions.length > 0) {
        expect(sortExceptions(exceptions)).toStrictEqual(sortExceptions(result.Exceptions))
      } else if (matching?.courtCaseReference) {
        expect(result.AnnotatedHearingOutcome.HearingOutcome.Case).toHaveProperty(
          "CourtCaseReferenceNumber",
          matching?.courtCaseReference
        )
        expect(matching.defendant.offences.length).toBeGreaterThan(0)
        for (const offence of matching.defendant.offences) {
          expect(offence).not.toHaveProperty("courtCaseReference")
          const resultOffence = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.find(
            (o) => o.CourtOffenceSequenceNumber === offence.hoSequenceNumber
          )
          const matchedOffenceSequence = parseNumber(resultOffence?.CriminalProsecutionReference.OffenceReasonSequence)
          expect(matchedOffenceSequence).toEqual(offence.pncSequenceNumber)
          expect(!!resultOffence?.AddedByTheCourt).toEqual(offence.addedByCourt)
        }
      } else if (matching) {
        for (const offence of matching.defendant.offences) {
          const resultOffence = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.find(
            (o) => o.CourtOffenceSequenceNumber === offence.hoSequenceNumber
          )
          expect(offence).toHaveProperty("courtCaseReference", resultOffence?.CourtCaseReferenceNumber)
          const matchedOffenceSequence = parseNumber(resultOffence?.CriminalProsecutionReference.OffenceReasonSequence)
          expect(matchedOffenceSequence).toEqual(offence.pncSequenceNumber)
          expect(!!resultOffence?.AddedByTheCourt).toEqual(offence.addedByCourt)
        }
      }
    })
  })
})
