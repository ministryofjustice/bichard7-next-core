import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addNullElementsForExceptions from "./addNullElementsForExceptions"

describe("addNullElementsForExceptions()", () => {
  it("should add a null element when it doesn't exist", () => {
    const aho: AnnotatedHearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {}
          }
        }
      },
      Exceptions: [
        {
          code: ExceptionCode.HO100100,
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ]
    } as AnnotatedHearingOutcome

    addNullElementsForExceptions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBeDefined()
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBeNull()
  })

  it("should add a null element when it and its parents don't exist", () => {
    const aho: AnnotatedHearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {}
      },
      Exceptions: [
        {
          code: ExceptionCode.HO100100,
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ]
    } as AnnotatedHearingOutcome

    addNullElementsForExceptions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case).toBeDefined()
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant).toBeDefined()
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBeDefined()
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBeNull()
  })

  it("should be able to handle arrays and paths with number components", () => {
    const aho: AnnotatedHearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [{}]
            }
          }
        }
      },
      Exceptions: [
        {
          code: ExceptionCode.HO100100,
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "CourtCaseReferenceNumber"
          ]
        }
      ]
    } as AnnotatedHearingOutcome

    addNullElementsForExceptions(aho)

    const element = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber
    expect(element).toBeDefined()
    expect(element).toBeNull()
  })

  it("should not change a value when it does already exist", () => {
    const aho: AnnotatedHearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              ArrestSummonsNumber: "foobar"
            }
          }
        }
      },
      Exceptions: [
        {
          code: ExceptionCode.HO100100,
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ]
    } as AnnotatedHearingOutcome

    addNullElementsForExceptions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).not.toBeNull()
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBe("foobar")
  })
})
