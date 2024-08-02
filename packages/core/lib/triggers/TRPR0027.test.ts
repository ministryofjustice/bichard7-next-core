import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import TRPR0027 from "./TRPR0027"
import { excludedTriggerConfig as excludedTriggers } from "bichard7-next-data-latest"

const generateMockAho = (forceCode: string, courtCode: string) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: { ForceOwner: { SecondLevelCode: forceCode } },
        Hearing: { CourtHearingLocation: { SecondLevelCode: courtCode } }
      }
    }
  }) as unknown as AnnotatedHearingOutcome

const generateTrigger = (
  forceCode: string,
  courtCode: string,

  triggersExcluded: boolean
) => {
  const generatedHearingOutcome = generateMockAho(forceCode, courtCode)
  const options = { triggersExcluded: triggersExcluded }
  return TRPR0027(generatedHearingOutcome, options)
}

const excludedTriggerConfig = () => {
  if (process.env.NODE_ENV === "test" && "01" in excludedTriggers) {
    excludedTriggers["01"] = [TriggerCode.TRPR0027]
  }
}

describe("TRPR0027", () => {
  it("Should generate a trigger when force code is not in excluded trigger config list, triggers are excluded, and force code doesn't equal court code", () => {
    const result = generateTrigger("00", "01", true)
    expect(result).toEqual([{ code: TriggerCode.TRPR0027 }])
  })

  it("Should generate a trigger when force code is in excluded trigger config list but doesn't have trigger TRPR0027, triggers are excluded, and force code doesn't equal court code", () => {
    const result = generateTrigger("01", "02", true)
    expect(result).toEqual([{ code: TriggerCode.TRPR0027 }])
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0027, triggers are excluded, and force code doesn't equal court code", () => {
    excludedTriggerConfig()
    const result = generateTrigger("01", "02", true)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0027, triggers are not excluded, and force code doesn't equal court code", () => {
    excludedTriggerConfig()
    const result = generateTrigger("01", "02", false)
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when force code is in excluded trigger config list and has trigger TRPR0027, triggers are excluded, and force code equals court code", () => {
    excludedTriggerConfig()
    const result = generateTrigger("01", "01", true)
    expect(result).toHaveLength(0)
  })

  it("Should generate a trigger when force code is in excluded trigger config list and has trigger TRPR0027, triggers are not excluded, and force code equals court code", () => {
    excludedTriggerConfig()
    const result = generateTrigger("01", "01", false)
    expect(result).toHaveLength(0)
  })
})
