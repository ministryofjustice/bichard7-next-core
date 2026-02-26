import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { bailConditionsImposed } from "./bailConditionsImposed"

describe("bailConditionsImposed", () => {
  const createMockAho = (conditions?: string[]): AnnotatedHearingOutcome => {
    return {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              BailConditions: conditions
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome
  }

  it("should join multiple bail conditions with a newline", () => {
    const aho = createMockAho(["Must not contact victim", "Must reside at given address"])

    const result = bailConditionsImposed(aho)

    expect(result).toBe("Must not contact victim\nMust reside at given address")
  })

  it("should return a single condition as-is without newlines", () => {
    const aho = createMockAho(["Must surrender passport"])

    const result = bailConditionsImposed(aho)

    expect(result).toBe("Must surrender passport")
  })

  it("should return the default NO_BAIL_CONDITIONS_TEXT when the array is empty", () => {
    const aho = createMockAho([])

    const result = bailConditionsImposed(aho)

    expect(result).toBe("No bail conditions found")
  })

  it("should return the default NO_BAIL_CONDITIONS_TEXT when BailConditions is undefined", () => {
    const aho = createMockAho(undefined)

    const result = bailConditionsImposed(aho)

    expect(result).toBe("No bail conditions found")
  })
})
