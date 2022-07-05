import convertAsnToLongFormat from "./convertAsnToLongFormat"

describe("convertAsnToLongFormat", () => {
  test.each([
    "YYFFUUSS123D",
    "YYFFUUSS00000000123D",
    "YyFfUUSS00000000123D",
    "YYFFUUSSX123D",
    "yyffUUSSX123D",
    "YY/FFUU/SS/123/D",
    "YY/FFUU/SS/00000000123/D",
    "Y/YFFUU/SSX123D"
  ])("should should convert correctly for %s", (inputASN) => {
    expect(convertAsnToLongFormat(inputASN)).toBe("YYFFUUSS00000000123D")
  })

  it("should return the original (capitalised) if the ID can't be parsed", () => {
    expect(convertAsnToLongFormat("yyffUUSSXXXXD")).toBe("YYFFUUSSXXXXD")
  })
})
