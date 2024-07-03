import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import TRPS0008 from "./TRPS0008"

describe("TRPS0008", () => {
  it("should return an empty array if options.phase is not equal to Phase.PNC_UPDATE", () => {
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
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return a trigger and offence sequence number if CJSresultCode equals 3105", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 3105
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              Reason: "test",
              FullCode: "3105"
            }
          }
        },
        CourtOffenceSequenceNumber: 1
      }
    ] as Offence[])
    const result = TRPS0008(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0008", offenceSequenceNumber: 1 }])
  })
})
