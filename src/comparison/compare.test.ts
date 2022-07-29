import fs from "fs"
import compare from "./compare"

describe("compare", () => {
  describe("success", () => {
    it("should correctly compare triggers", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/passing.json").toString()
      const result = compare(comparisonFile)
      expect(result.triggersMatch).toBe(true)
    })

    it("should correctly compare exceptions", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/exceptions.json").toString()
      const result = compare(comparisonFile)
      expect(comparisonFile).toContain("HO100321")
      expect(result.exceptionsMatch).toBe(true)
    })

    it("should correctly compare xml output", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/passing.json").toString()
      const result = compare(comparisonFile)
      expect(result.xmlOutputMatches).toBe(true)
    })

    it("should correctly compare xml parsing", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/passing.json").toString()
      const result = compare(comparisonFile)
      expect(result.xmlParsingMatches).toBe(true)
    })
  })

  describe("failure", () => {
    it("should correctly compare triggers", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing.json").toString()
      const result = compare(comparisonFile)
      expect(result.triggersMatch).toBe(false)
    })

    it("should correctly compare exceptions", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing-exceptions.json").toString()
      const result = compare(comparisonFile)
      expect(comparisonFile).not.toContain("HO100321")
      expect(result.exceptionsMatch).toBe(false)
    })

    it("should correctly compare xml output", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing.json").toString()
      const result = compare(comparisonFile)
      expect(result.xmlOutputMatches).toBe(false)
    })

    it("should correctly compare xml parsing", () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing.json").toString()
      const result = compare(comparisonFile)
      expect(result.xmlParsingMatches).toBe(false)
    })
  })
})
