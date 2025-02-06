import Asn from "./Asn"

describe("Asn", () => {
  describe("#checkCharacter", () => {
    it.each([
      { asn: "2202XC0200000000021D", expectedCheckCharacter: "R" },
      { asn: "2005FF0500000000555P", expectedCheckCharacter: "P" },
      { asn: "9700000000000123456K", expectedCheckCharacter: "K" },
      { asn: "22FD112200001234560X", expectedCheckCharacter: "X" }
    ])("returns the arrest summons number in the PNC format", ({ asn, expectedCheckCharacter }) => {
      const checkCharacter = new Asn(asn).checkCharacter()

      expect(checkCharacter).toBe(expectedCheckCharacter)
    })
  })

  describe("#toPncFormat", () => {
    it("returns the arrest summons number in the PNC format", () => {
      const asnInPncFormat = new Asn("9700000000000123456K").toPncFormat()

      expect(asnInPncFormat).toBe("97/0000/00/123456K")
    })
  })
})
