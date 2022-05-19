import { createPNCCourtCase } from "tests/helpers/generateMockPncCase"
import { sortCourtCasesByAge } from "./sortCourtCases"

describe("sortCourtCasesByAge", () => {
  it("Should sort two cases and put the oldest first", () => {
    const newPncCase = createPNCCourtCase("09/11FG/568235X")
    const oldPncCase = createPNCCourtCase("05/11FG/568235X")

    const sortedCases = sortCourtCasesByAge([newPncCase, oldPncCase])

    expect(sortedCases).toStrictEqual([oldPncCase, newPncCase])
  })
})
