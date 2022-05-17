import {
  createHOOffence,
  createPNCCourtCaseOffence,
  createPNCPenaltyCaseOffence
} from "tests/helpers/generateMockOffences"
import matchOffencesWithSameOffenceCode from "./matchOffencesWithSameOffenceCode"

describe("matchOffencesWithSameOffenceCode()", () => {
  it("MorePNCOffencesPNCOffencesAreCourtOnes", () => {
    const pncOffence = createPNCCourtCaseOffence({ startDate: "08092009", endDate: "10102010" })
    const outcome = matchOffencesWithSameOffenceCode([], [pncOffence], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("NoPNCOffencesPNCOffencesAreCourtOnes", () => {
    const outcome = matchOffencesWithSameOffenceCode([], [], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("FewerPNCOffencesPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({ startDate: "2009-09-08" })
    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OneOfEachMatchingExactlyPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      startDate: "2009-09-09"
    })

    const pncOffence = createPNCCourtCaseOffence({ startDate: "09092009" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it("OneOfEachMatchingApproximatelyPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      startDate: "2009-09-10",
      endDate: "2010-10-10"
    })

    const pncOffence = createPNCCourtCaseOffence({ startDate: "09092009", endDate: "10102010" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it("OneOfEachNotMatchingPNCOffencesAreCourtOnes", () => {
    const hoOffence = createHOOffence({
      startDate: "2009-09-08"
    })

    const pncOffence = createPNCCourtCaseOffence({ startDate: "09092009" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("TwoOfEachBothPNCsExactlyMatchSameHOPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-05-08", resultCodes: ["1002"] })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ startDate: "08092009" }),
      createPNCCourtCaseOffence({ startDate: "08092009" })
    ]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[0], pncOffence: pncOffences[0] }])
  })

  it("OnePNCExactlyMatchingTwoHOsWithDifferentResultsPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ startDate: "08092009" })]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContain(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContain(hoOffences[1])
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OnePNCExactlyMatchingTwoHOsWithSameResultsPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ startDate: "08092009" })]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[1])
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OnePNCApproximatelyMatchingTwoHOsPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ startDate: "03092009" })]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("FourOffencesOnEachWithDifferentStartDatesInDifferentOrderPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-15", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-22", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-29", resultCodes: ["1002"] })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ startDate: "29092009" }),
      createPNCCourtCaseOffence({ startDate: "22092009" }),
      createPNCCourtCaseOffence({ startDate: "15092009" }),
      createPNCCourtCaseOffence({ startDate: "08092009" })
    ]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(4)
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[0], pncOffence: pncOffences[3] })
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[1], pncOffence: pncOffences[2] })
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[2], pncOffence: pncOffences[1] })
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[3], pncOffence: pncOffences[0] })
  })

  it("FourOffencesOnEachWithDifferentStartDatesInDifferentOrderPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-15", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-22", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-29", resultCodes: ["1002"] })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ startDate: "29092009" }),
      createPNCCourtCaseOffence({ startDate: "22092009" }),
      createPNCCourtCaseOffence({ startDate: "15092009" }),
      createPNCCourtCaseOffence({ startDate: "08092009" })
    ]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(4)
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[0], pncOffence: pncOffences[3] })
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[1], pncOffence: pncOffences[2] })
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[2], pncOffence: pncOffences[1] })
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[3], pncOffence: pncOffences[0] })
  })

  it("MorePNCOffencesPNCOffencesArePenaltyOnes", () => {
    const pncOffence = createPNCCourtCaseOffence({ startDate: "08092009", endDate: "10102010" })
    const outcome = matchOffencesWithSameOffenceCode([], [pncOffence], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("NoPNCOffencesPNCOffencesArePenaltyOnes", () => {
    const outcome = matchOffencesWithSameOffenceCode([], [], true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OneOfEachMatchingApproximatelyPNCOffencesArePenaltyOnes", () => {
    const hoOffence = createHOOffence({
      startDate: "2009-09-09",
      endDate: "2010-10-10"
    })

    const pncOffence = createPNCPenaltyCaseOffence({ startDate: "09092009", endDate: "10102010" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it("OneOfEachMatchingExactlyPNCOffencesArePenaltyOnes", () => {
    const hoOffence = createHOOffence({ startDate: "2009-09-09" })

    const pncOffence = createPNCPenaltyCaseOffence({ startDate: "09092009" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence, pncOffence }])
  })

  it("OneOfEachNotMatchingPNCOffencesArePenaltyOnes", () => {
    const hoOffence = createHOOffence({ startDate: "2009-09-08" })

    const pncOffence = createPNCPenaltyCaseOffence({ startDate: "09092009" })

    const outcome = matchOffencesWithSameOffenceCode([hoOffence], [pncOffence], true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OnePNCApproximatelyMatchingTwoHOsPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] })
    ]

    const pncOffences = [createPNCPenaltyCaseOffence({ startDate: "03092009" })]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OnePNCExactlyMatchingTwoHOsWithDifferentResultsPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] })
    ]

    const pncOffences = [createPNCPenaltyCaseOffence({ startDate: "08092009" })]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, true)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[1])
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("OnePNCExactlyMatchingTwoHOsWithSameResultsPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] })
    ]

    const pncOffences = [createPNCPenaltyCaseOffence({ startDate: "08092009" })]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[0], pncOffence: pncOffences[0] }])
  })

  it("TwoOfEachBothPNCsExactlyMatchSameHOPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-05-08", resultCodes: ["1002"] })
    ]

    const pncOffences = [
      createPNCPenaltyCaseOffence({ startDate: "08092009" }),
      createPNCPenaltyCaseOffence({ startDate: "08092009" })
    ]

    const outcome = matchOffencesWithSameOffenceCode(hoOffences, pncOffences, false)

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[0], pncOffence: pncOffences[0] }])
  })
})
