import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../../types/TriggerCode"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import mostSpecificForceRuleAllowsTrigger from "./mostSpecificForceRuleAllowsTrigger"

describe("mostSpecificForceRuleAllowsTrigger", () => {
  it("should return false when force code matches an 'exclude' rule", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: "53"
    } as OrganisationUnitCodes
    const result = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBe(false)
  })
  it("should return true when force code does match an 'include' rule", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: "47"
    } as OrganisationUnitCodes
    const result = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBe(true)
  })
  it("should return undefined when force code does not match a rule", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: "99"
    } as OrganisationUnitCodes
    const result = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0014)
    expect(result).toBeUndefined()
  })
})
