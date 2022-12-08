import fs from "fs"
import compareMessage from "./compareMessage"

describe("compare", () => {
  describe("success", () => {
    it("should correctly compare triggers", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/passing.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(result.triggersMatch).toBe(true)
    })

    it("should correctly compare exceptions", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/exceptions.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(comparisonFile).toContain("HO100321")
      expect(result.exceptionsMatch).toBe(true)
    })

    it("should correctly compare xml output", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/passing.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(result.xmlOutputMatches).toBe(true)
    })

    it("should correctly compare xml parsing", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/passing.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(result.xmlParsingMatches).toBe(true)
    })
  })

  describe("failure", () => {
    it("should correctly compare triggers", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(result.triggersMatch).toBe(false)
    })

    it("should correctly compare exceptions", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing-exceptions.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(comparisonFile).not.toContain("HO100321")
      expect(result.exceptionsMatch).toBe(false)
    })

    it("should correctly compare xml output", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(result.xmlOutputMatches).toBe(false)
    })

    it("should correctly compare xml parsing", async () => {
      const comparisonFile = fs.readFileSync("test-data/comparison/failing.json").toString()
      const result = await compareMessage(comparisonFile)
      expect(result.xmlParsingMatches).toBe(false)
    })
  })
})
