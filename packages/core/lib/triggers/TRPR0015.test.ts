import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import TRPR0015 from "./TRPR0015"
import Phase from "../../types/Phase"

describe("TRPR0015", () => {
  const triggerOptions = {
    triggers: [{ code: TriggerCode.TRPR0008 }],
    triggersExcluded: true,
    phase: Phase.HEARING_OUTCOME
  }

  const triggerCode = TriggerCode.TRPR0015

  const generateMockAho = (pncId: string, resultCode: number, RecordableOnPNCindicator: string) =>
    ({
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: {
                Result: {
                  CJSresultCode: resultCode
                },
                RecordableOnPNCindicator: RecordableOnPNCindicator
              }
            }
          }
        }
      },
      PncQuery: {
        pncId: pncId
      }
    }) as unknown as AnnotatedHearingOutcome

  it("Should generate trigger TRPR0015 if result code is 4592, the case is recordable (has pnc query and RecordableOnPNCindicator fields), and has triggers", () => {
    const result = TRPR0015(generateMockAho("2000/0448754K", 4592, "Yes"), triggerOptions)

    expect(result).toEqual({ code: triggerCode })
  })

  it("Should generate trigger TRPR0015 if result code is 4592, the case is recordable (has pnc query and RecordableOnPNCindicator fields), and no triggers", () => {
    const result = TRPR0015(generateMockAho("2000/0448754K", 4592, "Yes"))

    expect(result).toEqual({ code: triggerCode })
  })

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and has triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and has triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and has triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and no triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and no triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 4592, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and no triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and has triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and has triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and has triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query and no RecordableOnPNCindicator field), and no triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (no pnc query but has RecordableOnPNCindicator field), and no triggers", () => {})

  it("Should generate trigger TRPR0015 if result code is 9999, the case is not recordable (has pnc query but no RecordableOnPNCindicator field), and no triggers", () => {})
})
