import { TriggerCode } from "../../types/TriggerCode"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import mostSpecificCourtRuleAllowsTrigger from "./mostSpecificCourtRuleAllowsTrigger"

describe("mostSpecificCourtRuleAllowsTrigger", () => {
  it("should return false when court code matches an 'exclude' rule", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()
    const result = mostSpecificCourtRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBe(false)
  })
  // it("should return true when court code does match an 'include' rule", () => {
  //   const pncUpdateDataset = generateFakePncUpdateDataset()
  //   const result = mostSpecificCourtRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
  //   expect(result).toBe(true)
  // })
  // it("should return undefined when court code does not match a rule", () => {
  //   const pncUpdateDataset = generateFakePncUpdateDataset()
  //   const result = mostSpecificCourtRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
  //   expect(result).toBeUndefined()
  // })
})
