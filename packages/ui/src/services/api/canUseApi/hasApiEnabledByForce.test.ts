import { hasApiEnabledByForce } from "./hasApiEnabledByForce"

jest.mock("config", () => ({
  FORCES_WITH_API_ENABLED: new Set(["01", "02", "03"])
}))

describe("hasApiEnabledByForce", () => {
  it("should return true when force is enabled", () => {
    expect(hasApiEnabledByForce(["001"])).toBe(true)
    expect(hasApiEnabledByForce(["002"])).toBe(true)
  })

  it("should return false when force is not enabled", () => {
    expect(hasApiEnabledByForce(["099"])).toBe(false)
  })

  it("should return true when at least one force is enabled", () => {
    expect(hasApiEnabledByForce(["001", "099"])).toBe(true)
  })

  it("should return false when no forces are provided", () => {
    expect(hasApiEnabledByForce([])).toBe(false)
  })

  it("should handle force padding correctly", () => {
    expect(hasApiEnabledByForce(["1"])).toBe(true) // "1" -> "001" -> "01"
    expect(hasApiEnabledByForce(["01"])).toBe(true) // "01" -> "001" -> "01"
  })
})
