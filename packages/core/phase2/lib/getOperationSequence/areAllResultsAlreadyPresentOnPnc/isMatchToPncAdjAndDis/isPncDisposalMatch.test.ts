import type { PncDisposal } from "../../../../../types/PncQueryResult"
import isPncDisposalMatch from "./isPncDisposalMatch"

describe("isPncDisposalMatch", () => {
  const defaultDisposal: PncDisposal = {
    qtyDate: "date",
    qtyDuration: "15",
    qtyMonetaryValue: "150",
    qtyUnitsFined: "GBP",
    qualifiers: "extra qualifiers",
    text: "some text",
    type: 1234
  }

  it("should return true when disposals have the same values", () => {
    const sameDisposal = structuredClone(defaultDisposal)
    const result = isPncDisposalMatch(defaultDisposal, sameDisposal)

    expect(result).toBe(true)
  })

  it("should return false when disposals have different type", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.type = 9999
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different qualifiers", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.qualifiers = "something different"
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different dates", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.qtyDate = "11-11-2011"
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different monetary values", () => {
    const disposal = {
      ...defaultDisposal,
      qtyMonetaryValue: "FOOBAR"
    } as unknown as PncDisposal
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different durations", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.qtyDuration = "FOOBAR"
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different text", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.text = "FOOBAR"
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different text because one is undefined", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.text = undefined
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return false when disposals have different durations because one is undefined", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.qtyDuration = undefined
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(false)
  })

  it("should return true when disposals have different qty units (not compared)", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.qtyUnitsFined = "FOOBAR"
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(true)
  })

  it("should return true when disposals have same text with case difference", () => {
    const disposal = structuredClone(defaultDisposal)
    disposal.text = defaultDisposal.text?.toUpperCase()
    const result = isPncDisposalMatch(defaultDisposal, disposal)

    expect(result).toBe(true)
  })
})
