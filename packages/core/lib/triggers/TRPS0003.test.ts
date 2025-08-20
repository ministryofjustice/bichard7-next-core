import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import Phase from "../../types/Phase"
import TRPS0003 from "./TRPS0003"

const recordableOffence = {
  CriminalProsecutionReference: {
    OffenceReasonSequence: "1"
  }
} as any as Offence

const generateAho = (ResultVariableText?: string[]) =>
  generateAhoFromOffenceList(
    (ResultVariableText?.map((text, index) => ({
      ...recordableOffence,
      CourtOffenceSequenceNumber: index + 1,
      Result: [{ ResultVariableText: text, ResultQualifierVariable: [], CJSresultCode: 3041, PNCDisposalType: 1001 }]
    })) as any as Offence[]) ?? []
  )

describe("TRPS0003", () => {
  it("should not return a trigger if phase is not PNC_UPDATE", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generateAho([`DEFENDANT EXCLUDED FROM ${"a".repeat(65)} FOR A PERIOD OF`])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if there are no offences with too long disposal text", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAho([`DEFENDANT EXCLUDED FROM ${"a".repeat(50)} FOR A PERIOD OF`])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return trigger and offence sequence number if offence has too long disposal text", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAho([`DEFENDANT EXCLUDED FROM ${"a".repeat(65)} FOR A PERIOD OF`])
    generatedHearingOutcome.Exceptions = [
      {
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      }
    ] as Exception[]
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([
      {
        code: "TRPS0003",
        offenceSequenceNumber: 1
      }
    ])
  })

  it("should return trigger and offence sequence number if multiple offences have too long disposal text", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAho([
      `DEFENDANT EXCLUDED FROM ${"a".repeat(65)} FOR A PERIOD OF`,
      `DEFENDANT EXCLUDED FROM ${"a".repeat(65)} FOR A PERIOD OF`,
      `DEFENDANT EXCLUDED FROM ${"a".repeat(65)} FOR A PERIOD OF`
    ])
    generatedHearingOutcome.Exceptions = [
      {
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      },
      {
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "Result",
          0,
          "ResultVariableText"
        ]
      },
      {
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          2,
          "Result",
          0,
          "ResultVariableText"
        ]
      }
    ] as Exception[]
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([
      {
        code: "TRPS0003",
        offenceSequenceNumber: 1
      },
      {
        code: "TRPS0003",
        offenceSequenceNumber: 2
      },
      {
        code: "TRPS0003",
        offenceSequenceNumber: 3
      }
    ])
  })
})
