import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import TRPS0002 from "./TRPS0002"

describe("TRPS0002", () => {
  it("should return  an empty array if options.phase is not equal to Phase.PNC_UPDATE", () => {
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
    const result = TRPS0002(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return trigger code if CJSresultCode equals 3107", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 3107
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0002(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0002" }])
  })

  it("should return an empty array if CJSresultCode does not equal 3107", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0002(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })
})
