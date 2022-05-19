import { createPNCCourtCaseOffence } from "tests/helpers/generateMockOffences"
import createPNCCourtCase from "tests/helpers/generateMockPncCase"
import { sortCourtCasesByAge } from "./sortCourtCases"

describe("sortCourtCasesByAge", () => {
  it("Should sort two cases and put the case with the earliest year first", () => {
    const newPncCase = createPNCCourtCase("09/11FG/568235X")
    const oldPncCase = createPNCCourtCase("05/11FG/568235X")

    const sortedCases = sortCourtCasesByAge([newPncCase, oldPncCase])

    expect(sortedCases).toStrictEqual([oldPncCase, newPncCase])
  })

  it("Should sort two cases and put the case with the lowest sequence number first", () => {
    const newPncCase = createPNCCourtCase("09/11FG/568235X")
    const oldPncCase = createPNCCourtCase("09/11FG/123235X")

    const sortedCases = sortCourtCasesByAge([newPncCase, oldPncCase])

    expect(sortedCases).toStrictEqual([oldPncCase, newPncCase])
  })

  it("Should leave to identical cases in the same order", () => {
    const offence = createPNCCourtCaseOffence({ startDate: "08092009" })
    const case1 = createPNCCourtCase("09/11FG/568235X", [offence])
    const case2 = createPNCCourtCase("09/11FG/568235X")

    const sortedCases = sortCourtCasesByAge([case1, case2])

    expect(sortedCases).toStrictEqual([case1, case2])
  })

  it("Should still sort cases with malformed CCR", () => {
    const goodCase = createPNCCourtCase("09/11FG/568235X")
    const malformedCase = createPNCCourtCase("09/11FG")

    const sortedCases = sortCourtCasesByAge([goodCase, malformedCase])

    expect(sortedCases).toStrictEqual([malformedCase, goodCase])
  })

  it("Should sort multiple cases", () => {
    const newestCase = createPNCCourtCase("10/11FG/568235X")
    const newerCase = createPNCCourtCase("07/11FG/568235X")
    const olderCase = createPNCCourtCase("05/11FG/568235X")
    const oldestCase = createPNCCourtCase("03/11FG/568235X")

    const sortedCases = sortCourtCasesByAge([olderCase, newestCase, oldestCase, newerCase])

    expect(sortedCases).toStrictEqual([oldestCase, olderCase, newerCase, newestCase])
  })
})
