import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { Offence } from "../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../types/PncOperation"
import ResultClass from "../../types/ResultClass"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"

jest.mock("../lib/areAllResultsOnPnc")

const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
mockedAreAllResultsOnPnc.mockReturnValue(true)

describe("checkClashingCourtCaseOperationsException", () => {
  it("generates an exception when provided clashing court case operations are found", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: false }
        ]
      },
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "2" },
        Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }]
      }
    ] as Offence[])

    const exceptions = checkClashingCourtCaseOperationsException(
      aho,
      [PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED],
      ExceptionCode.HO200112
    )

    expect(exceptions).toEqual([
      {
        code: "HO200112",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("doesn't generate an exception when provided clashing court case operations are found but don't have clashing CCRs", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: false }
        ]
      },
      {
        CourtCaseReferenceNumber: "2",
        CriminalProsecutionReference: { OffenceReasonSequence: "2" },
        Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }]
      }
    ] as Offence[])

    const exceptions = checkClashingCourtCaseOperationsException(
      aho,
      [PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED],
      ExceptionCode.HO200112
    )

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't generate an exception when provided clashing court case operations don't match", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: false }
        ]
      },
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "2" },
        Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }]
      }
    ] as Offence[])

    const exceptions = checkClashingCourtCaseOperationsException(
      aho,
      [PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED],
      ExceptionCode.HO200112
    )

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't generate an exception when no court case operations are generated", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [{ ResultClass: ResultClass.ADJOURNMENT }]
      }
    ] as Offence[])

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = "2"

    const exceptions = checkClashingCourtCaseOperationsException(
      aho,
      [PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED],
      ExceptionCode.HO200112
    )

    expect(exceptions).toHaveLength(0)
  })
})
