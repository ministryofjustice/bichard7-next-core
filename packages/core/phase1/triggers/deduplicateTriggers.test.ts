import { TriggerCode } from "types/TriggerCode"
import type { Trigger } from "phase1/types/Trigger"
import deduplicateTriggers from "phase1/triggers/deduplicateTriggers"

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
