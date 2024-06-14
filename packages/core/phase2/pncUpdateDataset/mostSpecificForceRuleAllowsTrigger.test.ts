import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../../types/TriggerCode"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import mostSpecificForceRuleAllowsTrigger from "./mostSpecificForceRuleAllowsTrigger"

describe("mostSpecificForceRuleAllowsTrigger", () => {
  it("should return true", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: "53"
    } as OrganisationUnitCodes
    const result = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBe(false)
  })
})
