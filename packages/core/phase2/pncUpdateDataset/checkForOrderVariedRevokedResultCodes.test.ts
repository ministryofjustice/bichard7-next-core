import checkForOrderVariedRevokedResultCodes from "./checkForOrderVariedRevokedResultCodes"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence, Result } from "../../types/AnnotatedHearingOutcome"

describe("checkForOrderVariedRevokedResultCodes", () => {
  it("returns false if there are no offences", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(false)
  })

  it("returns false if an offence has no results", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
      {
        Result: []
      } as unknown as Offence
    ])

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(false)
  })

  it("returns false if an offence has a result", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [{ CJSresultCode: 1234 }]
      } as unknown as Offence
    ])

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(false)
  })

  it("returns false if hearing defendant result exists", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = {
      CJSresultCode: 1234
    } as Result

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(false)
  })
})
