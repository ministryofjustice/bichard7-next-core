import { calculateBailStatus } from "./calculateBailStatus"

interface BailStatusInputs {
  bail: boolean
  hasNextCourtAppearance: boolean
  noBail: boolean
  tRPR0002Present: boolean
  tRPR0012Present: boolean
}

describe("calculateBailStatus", () => {
  const createInputs = (overrides: Partial<BailStatusInputs> = {}): BailStatusInputs => ({
    bail: false,
    hasNextCourtAppearance: false,
    noBail: false,
    tRPR0002Present: false,
    tRPR0012Present: false,
    ...overrides
  })

  it("should return an empty string if Trigger 12 is present but Trigger 2 is missing", () => {
    const inputs = createInputs({
      bail: true,
      tRPR0002Present: false,
      tRPR0012Present: true
    })

    expect(calculateBailStatus(inputs)).toBe("")
  })

  it("should NOT return empty string if both Trigger 12 and Trigger 2 are present", () => {
    const inputs = createInputs({
      bail: true,
      tRPR0002Present: true,
      tRPR0012Present: true
    })

    expect(calculateBailStatus(inputs)).toBe("Bail")
  })

  it("should return Bail if the bail flag is true", () => {
    const inputs = createInputs({ bail: true })
    expect(calculateBailStatus(inputs)).toBe("Bail")
  })

  it("should return No Bail if the noBail flag is true", () => {
    const inputs = createInputs({ noBail: true })
    expect(calculateBailStatus(inputs)).toBe("No Bail")
  })

  it("should prioritize Bail over No Bail if both are true", () => {
    const inputs = createInputs({
      bail: true,
      noBail: true
    })
    expect(calculateBailStatus(inputs)).toBe("Bail")
  })

  it("should return Bail if there is a next court appearance", () => {
    const inputs = createInputs({ hasNextCourtAppearance: true })
    expect(calculateBailStatus(inputs)).toBe("Bail")
  })

  it("should prioritize No Bail over Next Court Appearance", () => {
    const inputs = createInputs({
      hasNextCourtAppearance: true,
      noBail: true
    })
    expect(calculateBailStatus(inputs)).toBe("No Bail")
  })

  it("should default to No Bail when no flags are set", () => {
    const inputs = createInputs()
    expect(calculateBailStatus(inputs)).toBe("No Bail")
  })
})
