import convertAsnToLongFormat from "./convertAsnToLongFormat"

describe("convertAsnToLongFormat", () => {
  test.each([
    "YYFFUUSS123D",
    "YYFFUUSS00000000123D",
    "YyFfUUSS00000000123D",
    "YY/FFUU/SS/123/D",
    "YY/FFUU/SS/00000000123/D"
  ])("should should convert correctly for %s", (inputASN) => {
    expect(convertAsnToLongFormat(inputASN)).toBe("YYFFUUSS00000000123D")
  })

  test.each(["YYFFUUSSX123D", "yyffUUSSX123D", "Y/YFFUU/SSX123D"])(
    "should return the original (capitalised) if the ID can't be parsed",
    () => {
      expect(convertAsnToLongFormat("yyffUUSSXXXXD")).toBe("YYFFUUSSXXXXD")
    }
  )
})
