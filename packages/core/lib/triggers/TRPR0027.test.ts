import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import TRPR0027 from "./TRPR0027"

const generateMockAho = (forceCode: string, courtCode: string, hasForceOwner: boolean, hasHearing: boolean) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: hasForceOwner ? { ForceOwner: { SecondLevelCode: forceCode } } : {},
        Hearing: hasHearing ? { CourtHearingLocation: { SecondLevelCode: courtCode } } : {}
      }
    }
  }) as unknown as AnnotatedHearingOutcome

describe("TRPR0027", () => {
  it("Should generate a trigger when force code is not in excluded trigger config list, triggers are excluded, and force code doesn't equal court code", () => {
    const generatedHearingOutcome = generateMockAho("00", "01", true, true)
    const options = { triggersExcluded: true }
    const result = TRPR0027(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: TriggerCode.TRPR0027 }])
  })

  it("Should generate a trigger when force code is in excluded trigger config list but doesn't have trigger TRPR0027, triggers are excluded, and force code doesn't equal court code", () => {
    const generatedHearingOutcome = generateMockAho("01", "02", true, true)
    const options = { triggersExcluded: true }
    const result = TRPR0027(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: TriggerCode.TRPR0027 }])
  })

  it("Should not generate a trigger when aho has no force code, triggers are excluded, and force code doesn't equal court code", () => {
    const generatedHearingOutcome = generateMockAho("", "02", false, true)
    const options = { triggersExcluded: true }
    const result = TRPR0027(generatedHearingOutcome, options)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when aho has no force code, triggers are not excluded, and force code doesn't equal court code", () => {
    const generatedHearingOutcome = generateMockAho("", "02", false, true)
    const options = { triggersExcluded: false }
    const result = TRPR0027(generatedHearingOutcome, options)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when aho has no force code, triggers are excluded, and force code equals court code", () => {
    const generatedHearingOutcome = generateMockAho("", "", false, true)
    const options = { triggersExcluded: true }
    const result = TRPR0027(generatedHearingOutcome, options)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when aho has no force code, triggers are not excluded, and force code equals court code", () => {
    const generatedHearingOutcome = generateMockAho("", "", false, true)
    const options = { triggersExcluded: false }
    const result = TRPR0027(generatedHearingOutcome, options)
    expect(result).toHaveLength(0)
  })
})
