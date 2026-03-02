import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { caseAutomatedToPNC } from "./caseAutomatedToPNC"

describe("caseAutomatedToPNC", () => {
  const createMockAho = (recordable?: boolean): AnnotatedHearingOutcome => {
    return {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            RecordableOnPNCindicator: recordable
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome
  }

  describe("when there are errors", () => {
    it("should return 'No' if errorCount is 1 or greater, regardless of PNC indicator", () => {
      const ahoRecordable = createMockAho(true)
      const ahoNotRecordable = createMockAho(false)

      expect(caseAutomatedToPNC(ahoRecordable, 1)).toBe("No")
      expect(caseAutomatedToPNC(ahoNotRecordable, 5)).toBe("No")
    })
  })

  describe("when there are no errors", () => {
    it("should return 'Yes' if the case is recordable on PNC", () => {
      const aho = createMockAho(true)

      const result = caseAutomatedToPNC(aho, 0)

      expect(result).toBe("Yes")
    })

    it("should return 'n/a' if the case is explicitly NOT recordable on PNC", () => {
      const aho = createMockAho(false)

      const result = caseAutomatedToPNC(aho, 0)

      expect(result).toBe("n/a")
    })

    it("should return 'n/a' if the recordable on PNC indicator is undefined", () => {
      const aho = createMockAho(undefined)

      const result = caseAutomatedToPNC(aho, 0)

      expect(result).toBe("n/a")
    })
  })
})
