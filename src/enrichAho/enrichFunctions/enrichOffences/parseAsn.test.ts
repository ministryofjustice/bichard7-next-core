import parseAsn from "./parseAsn"

describe("parseAsn", () => {
  it("should handle 20 character ASNs", () => {
    expect(parseAsn("YYFFUUSS00000000123D")).toStrictEqual({
      bottomLevelCode: "SS",
      checkDigit: "D",
      secondLevelCode: "FF",
      thirdLevelCode: "UU",
      topLevelCode: undefined,
      year: "YY",
      sequenceNumber: "00000000123"
    })
  })

  it("should handle 21 character ASNs", () => {
    expect(parseAsn("YYBFFUUSS00000000123D")).toStrictEqual({
      bottomLevelCode: "SS",
      checkDigit: "D",
      secondLevelCode: "FF",
      thirdLevelCode: "UU",
      topLevelCode: "B",
      year: "YY",
      sequenceNumber: "00000000123"
    })
  })
})
