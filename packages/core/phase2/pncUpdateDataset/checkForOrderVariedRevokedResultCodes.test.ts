import type { Offence, Result } from "../../types/AnnotatedHearingOutcome"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import checkForOrderVariedRevokedResultCodes, * as checkForOrderVariedRevokedResultCodesModule from "./checkForOrderVariedRevokedResultCodes"

describe("checkForOrderVariedRevokedResultCodes", () => {
  beforeAll(() => {
    jest
      .spyOn(checkForOrderVariedRevokedResultCodesModule, "getUnknownOrderVariedRevokedResultCodes")
      .mockReturnValue([4000])
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

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

  it("returns false if CJS result code is not Order Varied Revoked", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [{ CJSresultCode: 1234 }]
      } as unknown as Offence
    ])

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(false)
  })

  it("returns false if hearing defendant result exists and CJS result code is not Order Varied Revoked", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = {
      CJSresultCode: 1234
    } as Result

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(false)
  })

  it("returns true and generate exception HO200111 if CJS result code is Order Varied Revoked", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [{ CJSresultCode: 4000 }]
      } as unknown as Offence
    ])

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(true)
    expect(pncUpdateDataset.Exceptions).toStrictEqual([
      {
        code: "HO200111",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "CJSresultCode"
        ]
      }
    ])
  })

  it("returns true and generate exception HO200111 if hearing defendant result exists and CJS result code is Order Varied Revoked", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = {
      CJSresultCode: 4000
    } as Result

    expect(checkForOrderVariedRevokedResultCodes(pncUpdateDataset)).toBe(true)
    expect(pncUpdateDataset.Exceptions).toStrictEqual([
      {
        code: "HO200111",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Result", 0, "CJSresultCode"]
      }
    ])
  })
})
