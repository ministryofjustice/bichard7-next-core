import type { PncDisposal } from "../types/PncQueryResult"
import isPncDisposalMatch from "./isPncDisposalMatch"

describe("isPncDisposalMatch", () => {
  const disposal = {
    qtyDate: "date",
    qtyDuration: "15",
    qtyMonetaryValue: "150",
    qtyUnitsFined: "GBP",
    qualifiers: "extra qualifiers",
    text: "some text",
    type: 1234
  } as PncDisposal
  it("should return true when disposals have the same values", () => {
    const same_disposal = structuredClone(disposal)
    const result = isPncDisposalMatch(disposal, same_disposal)

    expect(result).toBe(true)
  })
  it("should return false when disposals have different type", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.type = 9999
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different qualifiers", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.qualifiers = "something different"
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different dates", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.qtyDate = "11-11-2011"
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different monetary values", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.qtyMonetaryValue = "FOOBAR"
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different durations", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.qtyDuration = "FOOBAR"
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different text", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.text = "FOOBAR"
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different text because one is undefined", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.text = undefined
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return false when disposals have different durations because one is undefined", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.qtyDuration = undefined
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(false)
  })
  it("should return true when disposals have different qty units (not compared)", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.qtyUnitsFined = "FOOBAR"
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(true)
  })
  it("should return true when disposals have same text with case difference", () => {
    const disposal_2 = structuredClone(disposal)
    disposal_2.text = disposal.text?.toUpperCase()
    const result = isPncDisposalMatch(disposal, disposal_2)

    expect(result).toBe(true)
  })
})
