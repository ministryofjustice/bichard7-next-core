import ResultClass from "../../../phase1/types/ResultClass"
import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

describe("disarrCompatibleResultClass", () => {
  it("should return true when there is a recordable result and result class is not Adjournment post Judgement, Sentence, and Unresulted", () => {
    const offence = {
      Result: [
        {
          PNCDisposalType: 1001,
          ResultClass: ResultClass.ADJOURNMENT
        },
        {
          PNCDisposalType: 1000,
          ResultClass: ResultClass.UNRESULTED
        }
      ]
    } as Offence

    const result = disarrCompatibleResultClass(offence)

    expect(result).toBe(true)
  })

  it("should return false when all results are non-recordable", () => {
    const offence = {
      Result: [
        {
          PNCDisposalType: 1000,
          ResultClass: ResultClass.ADJOURNMENT
        },
        {
          PNCDisposalType: 1000,
          ResultClass: ResultClass.UNRESULTED
        }
      ]
    } as Offence

    const result = disarrCompatibleResultClass(offence)

    expect(result).toBe(false)
  })

  it("should return false when results are recordable but result classes are Adjournment post Judgement, Sentence, and Unresulted", () => {
    const offence = {
      Result: [
        {
          PNCDisposalType: 1001,
          ResultClass: ResultClass.UNRESULTED
        },
        {
          PNCDisposalType: 1001,
          ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT
        },
        {
          PNCDisposalType: 1001,
          ResultClass: ResultClass.SENTENCE
        }
      ]
    } as Offence

    const result = disarrCompatibleResultClass(offence)

    expect(result).toBe(false)
  })
})
