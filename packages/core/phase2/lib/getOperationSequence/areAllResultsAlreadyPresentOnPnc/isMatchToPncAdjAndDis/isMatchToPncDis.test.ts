import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import isMatchToPncDis from "./isMatchToPncDis"

describe("check isMatchToPncDis", () => {
  it("returns false when disposals list is empty", () => {
    const ahoResult = { ResultQualifierVariable: [] } as unknown as Result
    const result = isMatchToPncDis([], ahoResult, 0, 0)
    expect(result.value).toBe(false)
    expect(result.exceptions).toStrictEqual([])
  })

  it("returns true when an AHO result matches the pncDisposal on all its matching fields", () => {
    const pncDisposal: PncDisposal = {
      qtyDuration: "A4",
      qtyDate: "21052024",
      qtyMonetaryValue: "25000",
      qualifiers: "Q",
      type: 9999,
      text: "EXCLUDED FROM LOCATION"
    }
    const ahoResult: Result = {
      PNCDisposalType: 9999,
      CJSresultCode: 3041,
      ResultQualifierVariable: [{ Code: "Q" }],
      ResultVariableText: "DEFENDANT EXCLUDED FROM LOCATION FOR A PERIOD OF TIME",
      AmountSpecifiedInResult: [
        {
          Amount: 25000,
          DecimalPlaces: 2
        }
      ],
      DateSpecifiedInResult: [
        {
          Date: new Date("05/21/2024"),
          Sequence: 1
        }
      ],
      Duration: [
        {
          DurationLength: 4,
          DurationType: "",
          DurationUnit: "A"
        }
      ]
    } as Result

    const result = isMatchToPncDis([pncDisposal], ahoResult, 0, 0)
    expect(result.value).toBe(true)
    expect(result.exceptions).toStrictEqual([])
  })
})
