import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"

import { createAdjudicationFromOffence } from "./createAdjudicationFromOffence"

describe("createAdjudicationFromOffence", () => {
  it("returns undefined when no results for offence", () => {
    const dateOfHearing = new Date("2024-12-16")

    const adjudication = createAdjudicationFromOffence({ Result: [] } as unknown as Offence, dateOfHearing)

    expect(adjudication).toBeUndefined()
  })

  it("returns an adjudication from an offence", () => {
    const dateOfHearing = new Date("2024-12-16")

    const adjudication = createAdjudicationFromOffence(
      {
        Result: [{ PNCDisposalType: 1001, NumberOfOffencesTIC: 3, Verdict: "G", PleaStatus: "CON" } as Result]
      } as unknown as Offence,
      dateOfHearing
    )

    expect(adjudication).toStrictEqual({
      hearingDate: "16122024",
      numberOffencesTakenIntoAccount: "0003",
      pleaStatus: "CONSENTED",
      type: "ADJUDICATION",
      verdict: "GUILTY"
    })
  })

  it("returns an empty string for hearing date when non-date PNC disposal", () => {
    const dateOfHearing = new Date("2024-12-16")

    const adjudication = createAdjudicationFromOffence(
      {
        Result: [{ PNCDisposalType: 2059, NumberOfOffencesTIC: 3, Verdict: "G", PleaStatus: "CON" } as Result]
      } as unknown as Offence,
      dateOfHearing
    )

    expect(adjudication?.hearingDate).toBe("")
  })
})
