import convertAsnToLedsFormat from "./convertAsnToLedsFormat"

describe("convertAsnToLedsFormat", () => {
  it.each(["11/01ZD/01/1448754K", "1101ZD011448754K", "11/01ZD/01/00001448754K", "1101ZD0100001448754K"])(
    "should convert %s to LEDS format 11/01ZD/01/00001448754K",
    (asn) => {
      const ledsAsnFormat = convertAsnToLedsFormat(asn)
      expect(ledsAsnFormat).toBe("11/01ZD/01/00001448754K")
    }
  )
})
