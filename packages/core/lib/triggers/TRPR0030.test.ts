import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import TRPR0030 from "./TRPR0030"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const generateMockAho = (recordableOnPNCindicator: boolean, offenceCode: string, hasPncQuery: boolean) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: [
              {
                RecordableOnPNCindicator: recordableOnPNCindicator,
                CriminalProsecutionReference: {
                  OffenceReason: { OffenceCode: { FullCode: offenceCode } }
                }
              }
            ]
          }
        }
      }
    },
    ...(hasPncQuery ? { PncQuery: { PncId: "foo" } } : {})
  }) as unknown as AnnotatedHearingOutcome

describe("TRPR0030", () => {
  it.each(offenceCodes)(
    "Should generate a trigger when case has no recordable offence, no pnc query, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0030(generateMockAho(false, offenceCode, false))
      expect(result).toEqual([{ code: triggerCode }])
    }
  )

  it.each(offenceCodes)(
    "Should not generate a trigger when case has no recordable offence, has a pnc query, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0030(generateMockAho(false, offenceCode, true))
      expect(result).toHaveLength(0)
    }
  )

  it.each(offenceCodes)(
    "Should not generate a trigger when case has a recordable offence, has no pnc query, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0030(generateMockAho(true, offenceCode, false))
      expect(result).toHaveLength(0)
    }
  )

  it.each(offenceCodes)(
    "Should not generate a trigger when case has a recordable offence, has a pnc query, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0030(generateMockAho(true, offenceCode, true))
      expect(result).toHaveLength(0)
    }
  )

  it("Should not generate a trigger when case has no recordable offence, no pnc query, and offence code is not from the list", () => {
    const result = TRPR0030(generateMockAho(false, "XXXXXXX", false))
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when case has no recordable offence, has a pnc query, and offence code is not from the list", () => {
    const result = TRPR0030(generateMockAho(false, "XXXXXXX", true))
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when case has a recordable offence, has no pnc query, and offence code is not from the list", () => {
    const result = TRPR0030(generateMockAho(true, "XXXXXXX", false))
    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when case has a recordable offence, has a pnc query, and offence code is not from the list", () => {
    const result = TRPR0030(generateMockAho(true, "XXXXXXX", true))
    expect(result).toHaveLength(0)
  })
})
