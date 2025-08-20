import type { Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

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

  it("returns an empty string for hearing date and verdict when non-date and empty verdict PNC disposal", () => {
    const dateOfHearing = new Date("2024-12-16")
    const nonDateAndEmptyVerdictPncDisposal = 2059

    const adjudication = createAdjudicationFromOffence(
      {
        Result: [
          {
            PNCDisposalType: nonDateAndEmptyVerdictPncDisposal,
            NumberOfOffencesTIC: 3,
            Verdict: "G",
            PleaStatus: "CON"
          } as Result
        ]
      } as unknown as Offence,
      dateOfHearing
    )

    expect(adjudication).toStrictEqual({
      hearingDate: "",
      numberOffencesTakenIntoAccount: "0003",
      pleaStatus: "CONSENTED",
      type: "ADJUDICATION",
      verdict: ""
    })
  })
})
