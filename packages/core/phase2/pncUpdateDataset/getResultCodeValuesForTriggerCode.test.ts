import type { TriggerCode } from "../../types/TriggerCode"
import getResultCodeValuesForTriggerCode from "./getResultCodeValuesForTriggerCode"

describe("getResultCodeValuesForTriggerCode", () => {
  it("should return the result code values for TRPR0002", () => {
    const result = getResultCodeValuesForTriggerCode("TRPR0002" as TriggerCode)

    expect(result).toEqual([4575, 4576, 4577, 4585, 4586])
  })
  it("should return the result code values for TRPR0003A", () => {
    const result = getResultCodeValuesForTriggerCode("TRPR0003A" as TriggerCode)

    expect(result).toEqual([1141, 1142, 1143])
  })
  it("should return the result code values for TRPR0009", () => {
    const result = getResultCodeValuesForTriggerCode("TRPR0009" as TriggerCode)

    expect(result).toEqual([])
  })
  it("should return undefined for an unknown trigger code", () => {
    const result = getResultCodeValuesForTriggerCode("UNKNOWN" as TriggerCode)

    expect(result).toBeUndefined()
  })
})
