import {
  addDurationToDate,
  capitaliseExpression,
  capitalizeString,
  formatDuration,
  getNumberOfHours,
  getPleaStatus,
  getUrgentYesOrNo,
  getVerdict,
  getYesOrNo
} from "./valueTransformers"

jest.mock("@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json", () => [
  { cjsCode: "G", description: "GUILTY" },
  { cjsCode: "NG", description: "NOT GUILTY" }
])

jest.mock("@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json", () => [
  { cjsCode: "G", description: "GUILTY" },
  { cjsCode: "NG", description: "NOT GUILTY" }
])

jest.mock("@moj-bichard7-developers/bichard7-next-data/dist/types/Duration", () => ({
  Durations: {
    D: "Days",
    H: "Hours",
    M: "Months",
    W: "Weeks",
    Y: "Years"
  }
}))

describe("Utility Functions", () => {
  describe("capitalizeString", () => {
    it("should capitalize the first letter of a lowercase string", () => {
      expect(capitalizeString("hello")).toBe("Hello")
    })

    it("should keep already capitalized strings upper-case at start", () => {
      expect(capitalizeString("Hello")).toBe("Hello")
    })

    it("should return an empty string when passed empty string or default parameter", () => {
      expect(capitalizeString("")).toBe("")
      expect(capitalizeString()).toBe("")
    })
  })

  describe("getYesOrNo", () => {
    it("should return 'Yes' when input is true", () => {
      expect(getYesOrNo(true)).toBe("Yes")
    })

    it("should return 'No' when input is false", () => {
      expect(getYesOrNo(false)).toBe("No")
    })

    it("should return undefined when input is undefined", () => {
      expect(getYesOrNo(undefined)).toBeUndefined()
    })
  })

  describe("capitaliseExpression", () => {
    it("should capitalize only the first letter and make the rest lowercase", () => {
      expect(capitaliseExpression("TEST")).toBe("Test")
      expect(capitaliseExpression("TEST TEST")).toBe("Test test")
      expect(capitaliseExpression("tEst")).toBe("Test")
    })
  })

  describe("getUrgentYesOrNo", () => {
    it("should return 'Yes' when true", () => {
      expect(getUrgentYesOrNo(true)).toBe("Yes")
    })

    it("should return 'No' when false or undefined", () => {
      expect(getUrgentYesOrNo(false)).toBe("No")
      expect(getUrgentYesOrNo(undefined)).toBe("No")
    })
  })

  describe("getNumberOfHours", () => {
    it("should return formatted hours string when given a number", () => {
      expect(getNumberOfHours(5)).toBe("5 Hours")
    })

    it("should return undefined when input is 0 or undefined", () => {
      expect(getNumberOfHours(0)).toBeUndefined()
      expect(getNumberOfHours(undefined)).toBeUndefined()
    })
  })

  describe("formatDuration", () => {
    it("should format standard duration unit", () => {
      expect(formatDuration(10, "H")).toBe("10 Hours")
      expect(formatDuration(10, "D")).toBe("10 Days")
      expect(formatDuration(2, "W")).toBe("2 Weeks")
      expect(formatDuration(2, "M")).toBe("2 Months")
      expect(formatDuration(2, "Y")).toBe("2 Years")
    })

    it("should force conversion to months when forceMonths is true", () => {
      expect(formatDuration(60, "D", true)).toBe("2 Months")
      expect(formatDuration(1, "Y", true)).toBe("12 Months")
      expect(formatDuration(6, "M", true)).toBe("6 Months")
      expect(formatDuration(4, "W", true)).toBe("1 Months")
      expect(formatDuration(1440, "H", true)).toBe("2 Months")
    })

    it("should force conversion to months when forceMonths is true and round to nearest integer", () => {
      expect(formatDuration(61, "D", true)).toBe("2 Months")
      expect(formatDuration(5, "W", true)).toBe("1 Months")
      expect(formatDuration(1540, "H", true)).toBe("2 Months")
    })

    it("should throw an error for unsupported duration unit when forceMonths is true", () => {
      expect(() => formatDuration(10, "INVALID", true)).toThrow("Unsupported duration unit: INVALID")
    })
  })

  describe("addDurationToDate", () => {
    const baseDate = new Date("2025-01-01T00:00:00Z")

    it("should correctly add days", () => {
      const result = addDurationToDate(baseDate, 5, "D")
      expect(result.toISOString()).toContain("2025-01-06")
    })

    it("should correctly add hours", () => {
      const result = addDurationToDate(baseDate, 12, "H")
      expect(result.toISOString()).toContain("2025-01-01T12:00:00")
    })

    it("should correctly add months", () => {
      const result = addDurationToDate(baseDate, 2, "M")
      expect(result.toISOString()).toContain("2025-03-01")
    })

    it("should correctly add weeks", () => {
      const result = addDurationToDate(baseDate, 1, "W")
      expect(result.toISOString()).toContain("2025-01-08")
    })

    it("should correctly add years", () => {
      const result = addDurationToDate(baseDate, 1, "Y")
      expect(result.toISOString()).toContain("2026-01-01")
    })

    it("should throw an error for an unsupported unit", () => {
      expect(() => addDurationToDate(baseDate, 1, "INVALID")).toThrow("Unsupported duration unit: INVALID")
    })
  })

  describe("getPleaStatus", () => {
    it("should return formatted plea status description when matching code is found", () => {
      expect(getPleaStatus("G")).toBe("G (Guilty)")
      expect(getPleaStatus("NG")).toBe("NG (Not guilty)")
    })

    it("should return raw code when no match is found", () => {
      expect(getPleaStatus("UNKNOWN")).toBe("UNKNOWN")
    })

    it("should return undefined when code is undefined", () => {
      expect(getPleaStatus(undefined)).toBeUndefined()
    })
  })

  describe("getVerdict", () => {
    it("should return formatted verdict description when matching code is found", () => {
      expect(getVerdict("G")).toBe("G (Guilty)")
      expect(getVerdict("NG")).toBe("NG (Not guilty)")
    })

    it("should return raw code when no match is found", () => {
      expect(getVerdict("UNKNOWN")).toBe("UNKNOWN")
    })

    it("should return undefined when code is undefined", () => {
      expect(getVerdict(undefined)).toBeUndefined()
    })
  })
})
