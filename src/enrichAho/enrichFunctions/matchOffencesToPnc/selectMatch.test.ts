import type { Offence } from "src/types/AnnotatedHearingOutcome"
import MatchCandidates from "./MatchCandidates"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { selectMatch } from "./selectMatch"

describe("selectMatch()", () => {
  it("should select a single one-to-one match", () => {
    const hoOffence = {} as Offence
    const pncOffence = {} as PncOffenceWithCaseRef
    const candidates = new MatchCandidates()
    candidates.add({ hoOffence, pncOffence, exact: true })

    const selectedMatch = selectMatch(hoOffence, candidates)

    expect(selectedMatch).toStrictEqual(pncOffence)
  })

  it("should not select a match where multiple hoOffences match the same PNC offence", () => {
    const hoOffence1 = {} as Offence
    const hoOffence2 = {} as Offence
    const pncOffence = {} as PncOffenceWithCaseRef
    const candidates = new MatchCandidates()
    candidates.add({ hoOffence: hoOffence1, pncOffence, exact: true })
    candidates.add({ hoOffence: hoOffence2, pncOffence, exact: true })

    const selectedMatch = selectMatch(hoOffence1, candidates)

    expect(selectedMatch).toBeUndefined()
  })

  it("should not select a match where multiple hoOffences match multiple PNC offences", () => {
    const hoOffence1 = {} as Offence
    const hoOffence2 = {} as Offence
    const pncOffence1 = {} as PncOffenceWithCaseRef
    const pncOffence2 = {} as PncOffenceWithCaseRef
    const candidates = new MatchCandidates()
    candidates.add({ hoOffence: hoOffence1, pncOffence: pncOffence1, exact: true })
    candidates.add({ hoOffence: hoOffence2, pncOffence: pncOffence1, exact: true })
    candidates.add({ hoOffence: hoOffence1, pncOffence: pncOffence2, exact: true })
    candidates.add({ hoOffence: hoOffence2, pncOffence: pncOffence2, exact: true })

    const selectedMatch = selectMatch(hoOffence1, candidates)

    expect(selectedMatch).toBeUndefined()
  })

  it("should prioritise an exact match over a non-exact match", () => {
    const hoOffence1 = {} as Offence
    const hoOffence2 = {} as Offence
    const pncOffence1 = {} as PncOffenceWithCaseRef
    const pncOffence2 = {} as PncOffenceWithCaseRef
    const candidates = new MatchCandidates()
    candidates.add({ hoOffence: hoOffence1, pncOffence: pncOffence1, exact: true })
    candidates.add({ hoOffence: hoOffence1, pncOffence: pncOffence1, exact: false })
    candidates.add({ hoOffence: hoOffence2, pncOffence: pncOffence2, exact: false })

    const selectedMatch1 = selectMatch(hoOffence1, candidates)
    const selectedMatch2 = selectMatch(hoOffence1, candidates)

    expect(selectedMatch1).toStrictEqual(pncOffence1)
    expect(selectedMatch2).toStrictEqual(pncOffence2)
  })
})
