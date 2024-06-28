import createPncDisposal, {
  preProcessDate,
  preProcessDisposalQualifiers,
  preProcessDisposalQuantity
} from "./createPncDisposal"

describe("preProcessDate", () => {
  it("returns a string in dnnnDDMMYYYYNNNNNNN.NNUU format", () => {
    const result = preProcessDate(new Date("2024-05-10"))
    expect(result).toBe("10052024")
  })
})

describe("preProcessDisposalQuantity", () => {
  it("returns the correct format", () => {
    const result = preProcessDisposalQuantity("d", 123, 1, new Date("2024-05-10"), 9999999.99)
    expect(result).toHaveLength(24)
    expect(result).toBe("d123100520249999999.9900")
  })

  it("pads values to correct length", () => {
    const result = preProcessDisposalQuantity("d", 1, 1, new Date("2024-05-10"), 9.99)
    expect(result).toHaveLength(24)
    expect(result).toBe("d1  100520240000009.9900")
  })

  it("add padding for missing values", () => {
    const result = preProcessDisposalQuantity(undefined, undefined, undefined, undefined, undefined)
    expect(result).toHaveLength(24)
    expect(result).toBe("            0000000.0000")
  })

  it("uses pnc representation of life sentence", () => {
    const result = preProcessDisposalQuantity("L", 1, 1, new Date("2024-05-10"), 0)
    expect(result).toHaveLength(24)
    expect(result).toBe("Y999100520240000000.0000")
  })

  it("leaves disposalQuantity blank if unit is session", () => {
    const result = preProcessDisposalQuantity("S", 1, 1, new Date("2024-05-10"), 0)
    expect(result).toHaveLength(24)
    expect(result).toBe("    100520240000000.0000")
  })

  it("leaves disposalQuantity blank if unit is empty string", () => {
    const result = preProcessDisposalQuantity("", 1, 1, new Date("2024-05-10"), 0)
    expect(result).toHaveLength(24)
    expect(result).toBe("    100520240000000.0000")
  })

  it("leave date blank if disposal type is on no disposal date list", () => {
    const result = preProcessDisposalQuantity("D", 123, 2059, new Date("2024-05-10"), 0)
    expect(result).toHaveLength(24)
    expect(result).toBe("D123        0000000.0000")
  })
})

describe("preProcessDisposalQualifiers", () => {
  it("returns a string in qqQQqqQQDDDD format", () => {
    const result = preProcessDisposalQualifiers("A", 123, ["C", "E", "C", "F"], 1234)
    expect(result).toHaveLength(12)
    expect(result).toBe("C E C F A123")
  })

  it("omits qualifiers not in allowed list and appends S", () => {
    const result = preProcessDisposalQualifiers("A", 123, ["B", "B", "B", "B"], 1234)
    expect(result).toHaveLength(12)
    expect(result).toBe("S       A123")
  })

  it("uses pnc representation of life sentence", () => {
    const result = preProcessDisposalQualifiers("L", 123, ["C", "C", "C", "C"], 1234)
    expect(result).toHaveLength(12)
    expect(result).toBe("C C C C Y999")
  })

  it("adds S qualifiers to the end", () => {
    const result = preProcessDisposalQualifiers("A", 123, ["S", "C", "C", "C"], 1234)
    expect(result).toBe("C C C S A123")
  })

  it("Given a single qualifier, does not have trailing whitespace", () => {
    const result = preProcessDisposalQualifiers(undefined, undefined, ["F"], 1234)
    expect(result).toBe("F")
  })

  it("add S qualifier if result is <= to 6", () => {
    const result = preProcessDisposalQualifiers("A", 123, ["C", "C", "C"], 1234)
    expect(result).toBe("C C C S A123")
  })

  it("adds padding for when fewer than three qualifiers", () => {
    const result = preProcessDisposalQualifiers("A", 123, ["C"], 1234)
    expect(result).toBe("C S     A123")
  })
})

describe("createPncDisposal", () => {
  it("returns the correct fields", () => {
    const result = createPncDisposal(
      2060,
      "D",
      123,
      "A",
      5,
      new Date("2024-05-10"),
      12000.99,
      ["B", "C", "D", "E"],
      "disposal-text"
    )
    expect(result).toEqual({
      qtyDate: "10052024",
      qtyDuration: "D123",
      qtyMonetaryValue: "12000.99",
      qtyUnitsFined: "D123100520240012000.9900",
      qualifiers: "C E S   A5",
      text: "disposal-text",
      type: 2060
    })
  })
})
