import type { Offence } from "../../types/AnnotatedHearingOutcome"

import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import Phase from "../../types/Phase"
import TRPS0008 from "./TRPS0008"

describe("TRPS0008", () => {
  it("should not return a trigger if phase is not PNC_UPDATE and hearing outcome is PNC updated dataset", () => {
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
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return trigger and offence sequence number if offence code equals 3105", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "3105",
              Reason: "test"
            }
          }
        },
        Result: [
          {
            CJSresultCode: 3105
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0008", offenceSequenceNumber: 1 }])
  })

  it("should return trigger and offence sequence number if CJSresultCode equals 3105", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "3105",
              Reason: "test"
            }
          }
        },
        Result: [
          {
            CJSresultCode: 3105
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0008", offenceSequenceNumber: 1 }])
  })

  it("should not return a trigger if neither offence code nor CJSresultCode equals 3105", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "3107",
              Reason: "test"
            }
          }
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return trigger and offence sequence number for multiple offences", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "3105",
              Reason: "test"
            }
          }
        },
        Result: [
          {
            CJSresultCode: 3105
          }
        ]
      },
      {
        CourtOffenceSequenceNumber: 2,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "3105",
              Reason: "test"
            }
          }
        },
        Result: [
          {
            CJSresultCode: 3105
          }
        ]
      },
      {
        CourtOffenceSequenceNumber: 3,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "3310",
              Reason: "test"
            }
          }
        },
        Result: [
          {
            CJSresultCode: 3105
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([
      { code: "TRPS0008", offenceSequenceNumber: 1 },
      { code: "TRPS0008", offenceSequenceNumber: 2 },
      { code: "TRPS0008", offenceSequenceNumber: 3 }
    ])
  })
})
