import { TriggerCode } from "../../types/TriggerCode"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import mostSpecificForceRuleAllowsTrigger from "./mostSpecificForceRuleAllowsTrigger"

describe("mostSpecificForceRuleAllowsTrigger", () => {
  it("should return true", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()
    const result = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBe(false)
  })
})
