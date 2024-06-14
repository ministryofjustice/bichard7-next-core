import { TriggerCode } from "../../types/TriggerCode"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import mostSpecificCourtRuleAllowsTrigger from "./mostSpecificCourtRuleAllowsTrigger"

describe("mostSpecificCourtRuleAllowsTrigger", () => {
  it("should return false when court code matches an 'exclude' rule", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()

    const result = mostSpecificCourtRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBe(false)
  })
})
