import processTestFile from "tests/helpers/processTestFile"
import type { OldPhase1Comparison } from "../types/ComparisonFile"
import comparePhase1 from "./comparePhase1"
import type AuditLogEvent from "src/types/AuditLogEvent"

describe("compare", () => {
  let events: AuditLogEvent[] = []

  beforeEach(() => {
    events = []
  })

  describe("success", () => {
    it("should correctly compare triggers", async () => {
      const comparison = processTestFile("test-data/comparison/passing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(result.triggersMatch).toBe(true)
    })

    it("should correctly compare exceptions", async () => {
      const comparison = processTestFile("test-data/comparison/exceptions.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(comparison.annotatedHearingOutcome).toContain("HO100321")
      expect(result.exceptionsMatch).toBe(true)
    })

    it("should correctly compare xml output", async () => {
      const comparison = processTestFile("test-data/comparison/passing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(result.xmlOutputMatches).toBe(true)
    })

    it("should correctly compare xml parsing", async () => {
      const comparison = processTestFile("test-data/comparison/passing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(result.xmlParsingMatches).toBe(true)
    })
  })

  describe("failure", () => {
    it("should correctly compare triggers", async () => {
      const comparison = processTestFile("test-data/comparison/failing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(result.triggersMatch).toBe(false)
    })

    it("should correctly compare exceptions", async () => {
      const comparison = processTestFile("test-data/comparison/failing-exceptions.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(comparison.annotatedHearingOutcome).not.toContain("HO100321")
      expect(result.exceptionsMatch).toBe(false)
    })

    it("should correctly compare xml output", async () => {
      const comparison = processTestFile("test-data/comparison/failing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(result.xmlOutputMatches).toBe(false)
    })

    it("should correctly compare xml parsing", async () => {
      const comparison = processTestFile("test-data/comparison/failing.json") as OldPhase1Comparison
      const result = await comparePhase1(comparison, events)
      expect(result.xmlParsingMatches).toBe(false)
    })
  })
})
