import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import type Exception from "../types/Exception"
import TRPS0003 from "./TRPS0003"

describe("TRPS0003", () => {
  it("should not return a trigger if phase is not PNC_UPDATE and hearing outcome is PNC updated dataset", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 9999
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        }
      }
    ] as Offence[])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if there are no offences with the specific exceptions code HO200200", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 9999
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        }
      }
    ] as Offence[])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return trigger and offence sequence number if offence has the specific exceptions code HO200200", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Exceptions: [
          {
            code: "HO200200",
            path: ["Offence", "Result", "CJSresultCode"]
          }
        ],
        Result: [
          {
            CJSresultCode: 9999
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        CourtOffenceSequenceNumber: 1
      }
    ] as Offence[])
    const result = TRPS0003(generatedHearingOutcome, options)
    expect(result).toEqual([
      {
        code: "TRPS0003",
        offenceSequenceNumber: 1
      }
    ])
  })

  // it("should return trigger and offence sequence number if multiple offences have the specific exceptions code HO200200", () => {})
})
