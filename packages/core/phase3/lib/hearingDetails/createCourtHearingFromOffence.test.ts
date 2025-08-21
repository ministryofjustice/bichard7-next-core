import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { createCourtHearingFromOffence } from "./createCourtHearingFromOffence"

describe("createCourtHearingFromOffence", () => {
  it("creates a court hearing from an offence", () => {
    const courtHearing = createCourtHearingFromOffence({
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { OffenceCode: "11412HSD", AreaCode: "56" }
        },
        OffenceReasonSequence: "1"
      }
    } as Offence)

    expect(courtHearing).toStrictEqual({
      courtOffenceSequenceNumber: "001",
      offenceReason: "11412HSD",
      type: "ORDINARY"
    })
  })
})
