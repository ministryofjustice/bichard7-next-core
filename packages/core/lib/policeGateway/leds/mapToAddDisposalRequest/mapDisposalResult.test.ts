import { type PncUpdateDisposal, PncUpdateType } from "../../../../phase3/types/HearingDetails"
import mapDisposalResult from "./mapDisposalResult"

describe("mapDisposalResults", () => {
  it("should map disposal results when all fields are empty or null", () => {
    const disposal: PncUpdateDisposal = {
      disposalType: "",
      disposalQualifiers: "",
      disposalQuantity: "",
      disposalText: null,
      type: PncUpdateType.DISPOSAL
    }

    const disposalResult = mapDisposalResult(disposal)

    expect(disposalResult).toEqual({
      disposalCode: 0,
      disposalDuration: undefined,
      disposalEffectiveDate: undefined,
      disposalQualifiers: undefined,
      disposalText: undefined
    })
  })

  it("should map disposal results when fields have value", () => {
    const disposal: PncUpdateDisposal = {
      disposalType: "1015",
      disposalQualifiers: "A",
      disposalQuantity: "D123100520240012000.9900",
      disposalText: "Dummy text",
      type: PncUpdateType.DISPOSAL
    }

    const disposalResult = mapDisposalResult(disposal)

    expect(disposalResult).toEqual({
      disposalCode: 1015,
      disposalDuration: {
        count: 123,
        units: "days"
      },
      disposalEffectiveDate: "2024-05-10",
      disposalFine: {
        amount: 12000.99
      },
      disposalQualifiers: ["A"],
      disposalText: "Dummy text"
    })
  })

  it("should not populate disposalFine when amount is empty in disposalQuantity", () => {
    const disposal: PncUpdateDisposal = {
      disposalType: "1015",
      disposalQualifiers: "A",
      disposalQuantity: "D1231005202400          ",
      disposalText: "Dummy text",
      type: PncUpdateType.DISPOSAL
    }

    const disposalResult = mapDisposalResult(disposal)

    expect(disposalResult).toEqual({
      disposalCode: 1015,
      disposalDuration: {
        count: 123,
        units: "days"
      },
      disposalEffectiveDate: "2024-05-10",
      disposalQualifiers: ["A"],
      disposalText: "Dummy text"
    })
  })
})
