import { forcesWithEnvVariable, formatForceEnvVariable } from "utils/forceNormalisation"

describe("forceNormalisation", () => {
  describe("formatForceEnvVariable", () => {
    it("returns a set", () => {
      expect(formatForceEnvVariable("")).toBeInstanceOf(Set)
    })

    it("does not return '000' with empty string", () => {
      const forces = ""
      const result = formatForceEnvVariable(forces)

      const formatted = [...result]

      expect(formatted).toHaveLength(0)

      expect(formatted).toStrictEqual([])
    })

    it("parses strings with a comma", () => {
      const forces = "01,2,003"
      const result = formatForceEnvVariable(forces)

      const formatted = [...result]

      expect(formatted).toHaveLength(3)

      expect(formatted).toStrictEqual(["001", "002", "003"])
    })

    it("handles the same value", () => {
      const forces = "01,001,1"
      const result = formatForceEnvVariable(forces)

      const formatted = [...result]

      expect(formatted).toHaveLength(1)

      expect(formatted).toStrictEqual(["001"])
    })

    it("handles ill formed array", () => {
      const forces = "01,001,"
      const result = formatForceEnvVariable(forces)

      const formatted = [...result]

      expect(formatted).toHaveLength(1)

      expect(formatted).toStrictEqual(["001"])
    })
  })

  describe("forcesWithEnvVariable", () => {
    it("returns true with matching values", () => {
      const stubEnvVariable = formatForceEnvVariable("001")
      const visibleForces = ["001"]

      const result = forcesWithEnvVariable(stubEnvVariable, visibleForces)

      expect(result).toBe(true)
    })

    it("returns false with no values", () => {
      const stubEnvVariable = formatForceEnvVariable("")
      const visibleForces = ["001"]

      const result = forcesWithEnvVariable(stubEnvVariable, visibleForces)

      expect(result).toBe(false)
    })

    it("returns true with one matching value", () => {
      const stubEnvVariable = formatForceEnvVariable("001,002")
      const visibleForces = ["002"]

      const result = forcesWithEnvVariable(stubEnvVariable, visibleForces)

      expect(result).toBe(true)
    })

    it("returns true with '01' visible force", () => {
      const stubEnvVariable = formatForceEnvVariable("001")
      const visibleForces = ["01"]

      const result = forcesWithEnvVariable(stubEnvVariable, visibleForces)

      expect(result).toBe(true)
    })

    it("returns true with '1' visible force", () => {
      const stubEnvVariable = formatForceEnvVariable("001")
      const visibleForces = ["1"]

      const result = forcesWithEnvVariable(stubEnvVariable, visibleForces)

      expect(result).toBe(true)
    })
  })
})
