import type { Offence } from "../../types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import Phase from "../../types/Phase"
import { PncOperation } from "../../types/PncOperation"
import TRPS0004 from "./TRPS0004"

describe("TRPS0004", () => {
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
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if phase is PNC_UPDATE and hearingOutcome is not a PncUpdateDataset", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 1234
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return not return a trigger if there are no PncOperations with code NEWREM", () => {
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
    generatedHearingOutcome.PncOperations = []
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return a trigger if NEWREM operation is present", () => {
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
    generatedHearingOutcome.PncOperations = [
      {
        code: PncOperation.REMAND,
        status: "Completed"
      }
    ]
    const result = TRPS0004(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0004" }])
  })
})
