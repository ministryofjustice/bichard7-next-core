import comparePhase2 from "./comparePhase2"
import type { Phase2Comparison } from "../types/ComparisonFile"
import processTestFile from "./processTestFile"

describe("compare phase 2", () => {
  describe("success", () => {
    it("should correctly compare xml parsing", () => {
      const comparison = processTestFile("phase2/tests/fixtures/e2e-comparison/test-001.json") as Phase2Comparison
      const result = comparePhase2(comparison)
      expect(result.xmlParsingMatches).toBe(true)
    })
  })
  describe("failure", () => {
    it("should not correctly parse phase1 message", () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/failing.json") as Phase2Comparison
      const result = comparePhase2(comparison)
      expect(result.xmlParsingMatches).toBe(false)
    })
  })
})
