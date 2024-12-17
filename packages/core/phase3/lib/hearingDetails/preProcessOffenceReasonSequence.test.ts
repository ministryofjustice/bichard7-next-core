import type { Offence } from "../../../types/AnnotatedHearingOutcome"

import { preProcessOffenceReasonSequence } from "./preProcessOffenceReasonSequence"

describe("preProcessOffenceReasonSequence", () => {
  it("returns an offence reason sequence with left padded zeros", () => {
    const offenceReasonSequence = preProcessOffenceReasonSequence({
      CriminalProsecutionReference: { OffenceReasonSequence: "1" }
    } as Offence)

    expect(offenceReasonSequence).toBe("001")
  })

  it("returns an empty string when offence reason sequence is null", () => {
    const offenceReasonSequence = preProcessOffenceReasonSequence({
      CriminalProsecutionReference: { OffenceReasonSequence: null }
    } as Offence)

    expect(offenceReasonSequence).toBe("")
  })
})
