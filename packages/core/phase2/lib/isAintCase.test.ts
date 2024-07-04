import type { HearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import isAintCase from "./isAintCase"

const createHearingOutcome = (offences: Offence[]) =>
  ({
    Case: {
      HearingDefendant: {
        Offence: offences
      }
    }
  }) as HearingOutcome

describe("isAintCase", () => {
  it("should return true when a case has an AINT result", () => {
    const hearingOutcome = createHearingOutcome([
      {
        Result: [
          {
            PNCDisposalType: 1000,
            ResultVariableText: "Dummy variable text"
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: 1000,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      }
    ] as Offence[])

    const result = isAintCase(hearingOutcome)

    expect(result).toBe(true)
  })

  it("should return false when pncDisposal types are not 1000 (no CJS result code)", () => {
    const hearingOutcome = createHearingOutcome([
      {
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy variable text"
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: 1234,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      }
    ] as Offence[])

    const result = isAintCase(hearingOutcome)

    expect(result).toBe(false)
  })

  it("should return true when a case has an AINT result but PNC disposal type is undefined", () => {
    const hearingOutcome = createHearingOutcome([
      {
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy variable text"
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: undefined,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      }
    ] as Offence[])

    const result = isAintCase(hearingOutcome)

    expect(result).toBe(false)
  })

  it("should return true when a case has an AINT result but PNC disposal type is 1000 (No CJS result code)", () => {
    const hearingOutcome = createHearingOutcome([
      {
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy variable text"
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: 1000,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      }
    ] as Offence[])

    const result = isAintCase(hearingOutcome)

    expect(result).toBe(false)
  })

  it("should return false when no case has an AINT result", () => {
    const hearingOutcome = createHearingOutcome([
      {
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy variable text"
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy text. Hearing REGEX DOES NOT MATCH on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      }
    ] as Offence[])

    const result = isAintCase(hearingOutcome)

    expect(result).toBe(false)
  })

  it("should return false when all cases are added by court", () => {
    const hearingOutcome = createHearingOutcome([
      {
        AddedByTheCourt: true,
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      },
      {
        AddedByTheCourt: true,
        Result: [
          {
            PNCDisposalType: 9999,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          }
        ]
      }
    ] as Offence[])

    const result = isAintCase(hearingOutcome)

    expect(result).toBe(false)
  })
})
