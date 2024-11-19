import parseAsn from "./parseAsn"

describe("parseAsn", () => {
  it("should handle 20 character ASNs", () => {
    expect(parseAsn("YYFFUUSS00000000123D")).toStrictEqual({
      bottomLevelCode: "SS",
      checkDigit: "D",
      secondLevelCode: "FF",
      sequenceNumber: "00000000123",
      thirdLevelCode: "UU",
      topLevelCode: undefined,
      year: "YY"
    })
  })

  it("should handle 21 character ASNs", () => {
    expect(parseAsn("YYBFFUUSS00000000123D")).toStrictEqual({
      bottomLevelCode: "SS",
      checkDigit: "D",
      secondLevelCode: "FF",
      sequenceNumber: "00000000123",
      thirdLevelCode: "UU",
      topLevelCode: "B",
      year: "YY"
    })
  })

  it("should handle < 20 character ASNs", () => {
    expect(parseAsn("YYFFUUSS000123D")).toStrictEqual({
      bottomLevelCode: "SS",
      checkDigit: null,
      secondLevelCode: "FF",
      sequenceNumber: null,
      thirdLevelCode: "UU",
      topLevelCode: undefined,
      year: "YY"
    })
  })
})
