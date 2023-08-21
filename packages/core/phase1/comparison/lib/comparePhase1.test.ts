import processTestFile from "phase1/tests/helpers/processTestFile"
import type { OldPhase1Comparison } from "../types/ComparisonFile"
import comparePhase1 from "./comparePhase1"

describe("compare", () => {
  describe("success", () => {
    it("should correctly compare triggers", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/passing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(result.triggersMatch).toBe(true)
    })

    it("should correctly compare exceptions", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/exceptions.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(comparison.annotatedHearingOutcome).toContain("HO100321")
      expect(result.exceptionsMatch).toBe(true)
    })

    it("should correctly compare xml output", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/passing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(result.xmlOutputMatches).toBe(true)
    })

    it("should correctly compare xml parsing", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/passing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(result.xmlParsingMatches).toBe(true)
    })
  })

  describe("failure", () => {
    it("should correctly compare triggers", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/failing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(result.triggersMatch).toBe(false)
    })

    it("should correctly compare exceptions", async () => {
      const comparison = processTestFile(
        "phase1/tests/fixtures/comparison/failing-exceptions.json"
      ) as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(comparison.annotatedHearingOutcome).not.toContain("HO100321")
      expect(result.exceptionsMatch).toBe(false)
    })

    it("should correctly compare xml output", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/failing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(result.xmlOutputMatches).toBe(false)
    })

    it("should correctly compare xml parsing", async () => {
      const comparison = processTestFile("phase1/tests/fixtures/comparison/failing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison)
      expect(result.xmlParsingMatches).toBe(false)
    })
  })
})
