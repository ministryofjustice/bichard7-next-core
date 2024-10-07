import offenceMatcherSelectValue from "./offenceMatcherSelectValue"

describe("offenceMatcherSelectValue", () => {
  describe("returns offence reason sequence number", () => {
    it("when given offence reason sequence number as type number", () => {
      const result = offenceMatcherSelectValue(1)
      expect(result).toBe("1")
    })

    it("when given offence reason sequence number as type string", () => {
      const result = offenceMatcherSelectValue("1")
      expect(result).toBe("1")
    })

    it("when given offence reason sequence number and undefined", () => {
      const result = offenceMatcherSelectValue(1, undefined)
      expect(result).toBe("1")
    })

    it("when given offence reason sequence number and empty string", () => {
      const result = offenceMatcherSelectValue(1, "")
      expect(result).toBe("1")
    })
  })

  describe("returns offence reason sequence number and court case reference number", () => {
    it("when given both these as arguments", () => {
      const result = offenceMatcherSelectValue(1, "97/1626/008395Q")
      expect(result).toBe("1-97/1626/008395Q")
    })

    it("correctly formatted", () => {
      const result = offenceMatcherSelectValue(1, "97/1626/008395Q")
      expect(result).toMatch(/\d+-.*/)
    })
  })
})
