import { calculateWarrantType } from "./calculateWarrantType"

interface WarrantTypeInputs {
  firstInstance: boolean
  parentResult: boolean
  tRPR0002Present: boolean
  tRPR0012Present: boolean
  witnessResult: boolean
}

describe("calculateWarrantType", () => {
  const createInputs = (overrides: Partial<WarrantTypeInputs> = {}): WarrantTypeInputs => ({
    firstInstance: false,
    parentResult: false,
    tRPR0002Present: false,
    tRPR0012Present: false,
    witnessResult: false,
    ...overrides
  })

  it("should return Parent when parentResult is true", () => {
    const inputs = createInputs({ parentResult: true })
    expect(calculateWarrantType(inputs)).toBe("Parent")
  })

  it("should return Witness when witnessResult is true", () => {
    const inputs = createInputs({ witnessResult: true })
    expect(calculateWarrantType(inputs)).toBe("Witness")
  })

  it("should return First Instance when firstInstance is true", () => {
    const inputs = createInputs({ firstInstance: true })
    expect(calculateWarrantType(inputs)).toBe("First Instance")
  })

  it("should return FTA when tRPR0002Present is true", () => {
    const inputs = createInputs({ tRPR0002Present: true })
    expect(calculateWarrantType(inputs)).toBe("FTA")
  })

  it("should return Withdrawn when tRPR0012Present is true", () => {
    const inputs = createInputs({ tRPR0012Present: true })
    expect(calculateWarrantType(inputs)).toBe("Withdrawn")
  })

  it("should return empty string when no flags are true", () => {
    const inputs = createInputs()
    expect(calculateWarrantType(inputs)).toBe("")
  })

  it("should prioritize Parent over Witness", () => {
    const inputs = createInputs({
      parentResult: true,
      witnessResult: true
    })
    expect(calculateWarrantType(inputs)).toBe("Parent")
  })

  it("should prioritize Witness over First Instance", () => {
    const inputs = createInputs({
      firstInstance: true,
      witnessResult: true
    })
    expect(calculateWarrantType(inputs)).toBe("Witness")
  })

  it("should prioritize First Instance over FTA", () => {
    const inputs = createInputs({
      firstInstance: true,
      tRPR0002Present: true
    })
    expect(calculateWarrantType(inputs)).toBe("First Instance")
  })

  it("should prioritize FTA over Withdrawn (Trigger 12 only)", () => {
    const inputs = createInputs({
      tRPR0002Present: true,
      tRPR0012Present: false
    })
    expect(calculateWarrantType(inputs)).toBe("FTA")
  })

  it("should handle the special case of both Trigger 12 and Trigger 2 being present", () => {
    const inputs = createInputs({
      tRPR0002Present: true,
      tRPR0012Present: true
    })
    expect(calculateWarrantType(inputs)).toBe("Withdrawn\nFTA")
  })

  it("should combine special case Withdrawn with Parent if Parent is present", () => {
    const inputs = createInputs({
      parentResult: true,
      tRPR0002Present: true,
      tRPR0012Present: true
    })
    expect(calculateWarrantType(inputs)).toBe("Withdrawn\nParent")
  })

  it("should combine special case Withdrawn with Witness if Witness is present", () => {
    const inputs = createInputs({
      tRPR0002Present: true,
      tRPR0012Present: true,
      witnessResult: true
    })
    expect(calculateWarrantType(inputs)).toBe("Withdrawn\nWitness")
  })
})
