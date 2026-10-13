import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { excludedTriggerConfig as excludedTriggers } from "@moj-bichard7-developers/bichard7-next-data"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import TRPR0031 from "./TRPR0031"

const generateMockAho = (forceCode: string, courtCode: string) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: { ForceOwner: { SecondLevelCode: forceCode } },
        Hearing: { CourtHearingLocation: { SecondLevelCode: courtCode } }
      }
    }
  }) as AnnotatedHearingOutcome

const generateTrigger = (forceCode: string, courtCode: string, triggersExcluded: boolean, excludedForForce = false) => {
  const generatedHearingOutcome = generateMockAho(forceCode, courtCode)
  const options = { triggersExcluded: triggersExcluded }
  excludedTriggers["01"] = excludedForForce ? [TriggerCode.TRPR0031] : []

  return TRPR0031(generatedHearingOutcome, options)
}

describe("TRPR0031", () => {
  it("Should generate a trigger when force code is not in excluded trigger config list, triggers are excluded, and force code doesn't equal court code", () => {
    const result = generateTrigger("00", "01", true)
    expect(result).toEqual([{ code: TriggerCode.TRPR0031 }])
  })

  it("Should generate a trigger when force code is in excluded trigger config list but doesn't have trigger TRPR0031, triggers are excluded, and force code doesn't equal court code", () => {
    const result = generateTrigger("01", "02", true)
    expect(result).toEqual([{ code: TriggerCode.TRPR0031 }])
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0031, triggers are excluded, and force code doesn't equal court code", () => {
    const result = generateTrigger("01", "02", true, true)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0031, triggers are not excluded, and force code doesn't equal court code", () => {
    const result = generateTrigger("01", "02", false, true)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0031, triggers are excluded, and force code equals court code", () => {
    const result = generateTrigger("01", "01", true, true)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0031, triggers are not excluded, and force code equals court code", () => {
    const result = generateTrigger("01", "01", false, true)
    expect(result).toHaveLength(0)
  })
})
