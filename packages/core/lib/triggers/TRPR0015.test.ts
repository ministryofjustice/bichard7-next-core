import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import TRPR0015 from "./TRPR0015"
import Phase from "../../types/Phase"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

describe("TRPR0015", () => {
  const triggerOptions = {
    triggers: [{ code: TriggerCode.TRPR0008 }],
    triggersExcluded: true,
    phase: Phase.HEARING_OUTCOME
  }

  const triggerCode = TriggerCode.TRPR0015

  const generateMockAho = (hasPncQuery: boolean, resultCode: number, RecordableOnPNCindicator: string | undefined) =>
    ({
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [
                    {
                      CJSresultCode: resultCode
                    }
                  ],
                  RecordableOnPNCindicator: RecordableOnPNCindicator
                }
              ]
            }
          }
        }
      },
      ...(hasPncQuery ? { PncQuery: { PncId: "foo" } } : {})
    }) as unknown as AnnotatedHearingOutcome

  it("Should generate trigger TRPR0015 if result code is 4592, the case is recordable (has pnc query and RecordableOnPNCindicator fields), and has triggers", () => {
    const result = TRPR0015(generateMockAho(true, 4592, "Yes"), triggerOptions)

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should generate trigger TRPR0015 if result code is 4592, the case is recordable (has pnc query and RecordableOnPNCindicator fields), and no triggers", () => {
    const result = TRPR0015(generateMockAho(true, 4592, "Yes"))

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and has triggers", () => {
    const result = TRPR0015(generateMockAho(false, 4592, "Yes"), triggerOptions)

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and has triggers", () => {
    const result = TRPR0015(generateMockAho(true, 4592, undefined), triggerOptions)

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and has triggers", () => {
    const result = TRPR0015(generateMockAho(false, 4592, undefined), triggerOptions)

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should not generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and no triggers", () => {
    const result = TRPR0015(generateMockAho(false, 4592, undefined))

    expect(result).toHaveLength(0)
  })

  it("Should not generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and no triggers", () => {
    const result = TRPR0015(generateMockAho(false, 4592, "Yes"))

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should not generate trigger TRPR0015 if result code is 4592, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and no triggers", () => {
    const result = TRPR0015(generateMockAho(true, 4592, undefined))

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should generate trigger TRPR0015 if result code is 9999, the case is recordable (has pnc query and RecordableOnPNCindicator fields), and has triggers", () => {
    const result = TRPR0015(generateMockAho(true, 9999, "Yes"), triggerOptions)

    expect(result).toHaveLength(0)
  })

  it("Should generate trigger TRPR0015 if result code is 9999, the case is recordable (has pnc query and RecordableOnPNCindicator fields), and no triggers", () => {
    const result = TRPR0015(generateMockAho(true, 9999, "Yes"))

    expect(result).toHaveLength(0)
  })

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and has triggers", () => {
    const result = TRPR0015(generateMockAho(false, 9999, "Yes"), triggerOptions)

    expect(result).toHaveLength(0)
  })

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and has triggers", () => {
    const result = TRPR0015(generateMockAho(true, 9999, undefined), triggerOptions)

    expect(result).toHaveLength(0)
  })

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and has triggers", () => {
    const result = TRPR0015(generateMockAho(false, 9999, undefined), triggerOptions)

    expect(result).toHaveLength(0)
  })

  it("Should not generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and no triggers", () => {
    const result = TRPR0015(generateMockAho(false, 9999, undefined))

    expect(result).toHaveLength(0)
  })

  it("Should not generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and no triggers", () => {
    const result = TRPR0015(generateMockAho(false, 9999, "Yes"))

    expect(result).toHaveLength(0)
  })

  it("Should not generate trigger TRPR0015 if result code is 9999, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and no triggers", () => {
    const result = TRPR0015(generateMockAho(true, 9999, undefined))

    expect(result).toHaveLength(0)
  })
})
