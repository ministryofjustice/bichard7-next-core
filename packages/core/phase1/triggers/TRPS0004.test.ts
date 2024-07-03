import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import TRPS0004 from "./TRPS0004"

describe("TRPS0004", () => {
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
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return an empty array if is not a PNC update dataset", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return an empty array if there are no PncOperations with code NEWREM", () => {
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
    generatedHearingOutcome.PncOperations = []
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return an array with TRPS0004 if NEWREM operation is present", () => {
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
    generatedHearingOutcome.PncOperations = [
      {
        status: "Completed",
        code: "NEWREM"
      }
    ]
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0004" }])
  })
})
