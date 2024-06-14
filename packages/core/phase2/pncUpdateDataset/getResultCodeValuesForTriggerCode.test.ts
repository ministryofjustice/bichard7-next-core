import { TriggerCode } from "../../types/TriggerCode"
import getResultCodeValuesForTriggerCode from "./getResultCodeValuesForTriggerCode"

describe("getResultCodeValuesForTriggerCode", () => {
  it("should return the result code values for TRPR0002", () => {
    const result = getResultCodeValuesForTriggerCode(TriggerCode.TRPR0002)

    expect(result).toEqual([4575, 4576, 4577, 4585, 4586])
  })
  it("should return the result code values for TRPR0003A", () => {
    const result = getResultCodeValuesForTriggerCode(TriggerCode.TRPR0003A)

    expect(result).toEqual([1141, 1142, 1143])
  })
  it("should return the result code values for TRPR0009", () => {
    const result = getResultCodeValuesForTriggerCode(TriggerCode.TRPR0009)

    expect(result).toEqual([])
  })
  it("should return undefined for an unknown trigger code", () => {
    const result = getResultCodeValuesForTriggerCode("UNKNOWN" as TriggerCode)

    expect(result).toBeUndefined()
  })
})
