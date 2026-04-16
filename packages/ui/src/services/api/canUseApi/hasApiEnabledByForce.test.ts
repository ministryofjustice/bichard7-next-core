import { formatForceEnvVariable } from "utils/forceNormalisation"

const mockUseApiModule = (forcesWithApiEnabled: Set<string>) => {
  jest.doMock("../../../config.ts", () => ({
    FORCES_WITH_API_ENABLED: forcesWithApiEnabled
  }))
}

const forces = formatForceEnvVariable("01,02,03")

describe("hasApiEnabledByForce", () => {
  beforeEach(() => {
    mockUseApiModule(forces)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("should return true when force is enabled", () => {
    const { hasApiEnabledByForce } = require("./hasApiEnabledByForce")

    expect(hasApiEnabledByForce(["001"])).toBe(true)
    expect(hasApiEnabledByForce(["002"])).toBe(true)
  })

  it("should return false when force is not enabled", () => {
    const { hasApiEnabledByForce } = require("./hasApiEnabledByForce")

    expect(hasApiEnabledByForce(["099"])).toBe(false)
  })

  it("should return true when at least one force is enabled", () => {
    const { hasApiEnabledByForce } = require("./hasApiEnabledByForce")

    expect(hasApiEnabledByForce(["001", "099"])).toBe(true)
  })

  it("should return false when no forces are provided", () => {
    const { hasApiEnabledByForce } = require("./hasApiEnabledByForce")

    expect(hasApiEnabledByForce([])).toBe(false)
  })

  it("should handle force padding correctly", () => {
    const { hasApiEnabledByForce } = require("./hasApiEnabledByForce")

    expect(hasApiEnabledByForce(["1"])).toBe(true) // "1" -> "001"
    expect(hasApiEnabledByForce(["01"])).toBe(true) // "01" -> "001"
  })
})
