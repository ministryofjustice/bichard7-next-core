import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"

import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import Phase from "../../types/Phase"
import TRPS0003 from "./TRPS0003"

describe("TRPS0003", () => {
  it("should not return a trigger if phase is not PNC_UPDATE", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if there are no offences with the specific exceptions code HO200200", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return trigger and offence sequence number if offence has the specific exceptions code HO200200", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])
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

  it("should return trigger and offence sequence number if multiple offences have the specific exceptions code HO200200", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      },
      {
        CourtOffenceSequenceNumber: 2,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9991
          }
        ]
      },
      {
        CourtOffenceSequenceNumber: 3,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9992
          }
        ]
      }
    ] as Offence[])
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
