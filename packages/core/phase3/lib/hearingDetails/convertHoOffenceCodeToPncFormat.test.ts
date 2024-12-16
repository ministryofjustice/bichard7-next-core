import { convertHoOffenceCodeToPncFormat } from "./convertHoOffenceCodeToPncFormat"

describe("convertHoOffenceCodeToPncFormat", () => {
  it("returns an empty string when offence reason is undefined", () => {
    const offenceReasonInPncFormat = convertHoOffenceCodeToPncFormat(undefined)

    expect(offenceReasonInPncFormat).toBe("")
  })

  it("returns the local offence code when offence reason is a local offence", () => {
    const offenceReasonInPncFormat = convertHoOffenceCodeToPncFormat({
      __type: "LocalOffenceReason",
      LocalOffenceCode: { OffenceCode: "11412HSD", AreaCode: "56" }
    })

    expect(offenceReasonInPncFormat).toBe("11412HSD")
  })

  it("returns the full offence code when national offence reason", () => {
    const offenceReasonInPncFormat = convertHoOffenceCodeToPncFormat({
      __type: "NationalOffenceReason",
      OffenceCode: {
        __type: "NonMatchingOffenceCode",
        ActOrSource: "AA",
        Year: "03",
        Reason: "984",
        FullCode: "AA03984"
      }
    })

    expect(offenceReasonInPncFormat).toBe("AA03984")
  })
})
