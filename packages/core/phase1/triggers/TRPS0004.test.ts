import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import TRPS0004 from "./TRPS0004"

describe("TRPS0004", () => {
  it("should return an empty array if PncOperations is not in hearingOutcome", () => {
    const pncUpdateDataset = generateAhoFromOffenceList([
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

    const options = { phase: Phase.HEARING_OUTCOME }
    const result = TRPS0004(pncUpdateDataset, options)
    expect(result).toEqual([])
  })
  it("should generate an empty array if the phase is not PNC_UPDATE", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
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
    pncUpdateDataset.PncOperations = []

    const options = { phase: Phase.HEARING_OUTCOME }
    const result = TRPS0004(pncUpdateDataset, options)
    expect(result).toEqual([])
  })

  it('should return an empty array if PncOperations does not contain an operation with code "NEWREM"', () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
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

    const options = { phase: Phase.PNC_UPDATE }
    const result = TRPS0004(pncUpdateDataset, options)
    expect(result).toEqual([])
  })

  it('should return trigger TRPS0004 if PncOperations contains an operation with code "NEWREM"', () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
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
    pncUpdateDataset.PncOperations = [
      {
        code: "NEWREM",
        status: "Completed"
      }
    ]
    const options = { phase: Phase.PNC_UPDATE }
    const result = TRPS0004(pncUpdateDataset, options)
    expect(result).toEqual([{ code: "TRPS0004" }])
  })

  it('should return trigger TRPS0004 if PncOperations contains multiple operations with code "NEWREM"', () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
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
    pncUpdateDataset.PncOperations = [
      {
        code: "NEWREM",
        status: "Completed"
      },
      {
        code: "NEWREM",
        status: "Completed"
      }
    ]
    const options = { phase: Phase.PNC_UPDATE }
    const result = TRPS0004(pncUpdateDataset, options)
    expect(result).toEqual([{ code: "TRPS0004" }])
  })
})
