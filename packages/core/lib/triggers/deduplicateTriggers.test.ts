import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Trigger } from "../../types/Trigger"
import deduplicateTriggers from "./deduplicateTriggers"

describe("deduplicateTriggers", () => {
  it("should remove duplicates", () => {
    const triggers: Trigger[] = [
      { code: TriggerCode.TRPR0015 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 1 }
    ]
    const result = deduplicateTriggers(triggers)
    expect(result).toStrictEqual([
      { code: TriggerCode.TRPR0015 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 1 }
    ])
  })
  it("should not remove non-duplicates", () => {
    const triggers: Trigger[] = [
      { code: TriggerCode.TRPR0015 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 2 }
    ]
    const result = deduplicateTriggers(triggers)
    expect(result).toStrictEqual([
      { code: TriggerCode.TRPR0015 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0020, offenceSequenceNumber: 2 }
    ])
  })

  it("should handle an empty list of triggers", () => {
    const result = deduplicateTriggers([])
    expect(result).toStrictEqual([])
  })
})
