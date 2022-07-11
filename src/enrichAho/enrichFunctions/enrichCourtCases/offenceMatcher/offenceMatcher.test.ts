import type { PncOffence } from "src/types/PncQueryResult"
import {
  createHOOffence,
  createPNCCourtCaseOffence,
  createPNCPenaltyCaseOffence
} from "tests/helpers/generateMockOffences"
import { matchOffences } from "./offenceMatcher"

describe("Offence Matcher", () => {
  it("successfully matches a single matching offence on PNC and HO with sequence numbers", () => {
    const hoOffences = [createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"], sequenceNumber: 1 })]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 1 })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toStrictEqual([{ hoOffence: hoOffences[0], pncOffence: pncOffences[0] }])
  })

  it("should testMatchOffencesAllWithSameOffenceCodeMatchesFoundPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-15", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-22", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-29", resultCodes: ["1002"] })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "29092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "22092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "15092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(4)

    outcome.matchedOffences.forEach((match) => {
      const hoOffenceIndex = hoOffences.indexOf(match.hoOffence)
      expect(match.pncOffence).toStrictEqual(pncOffences[3 - hoOffenceIndex])
    })
  })

  it("should testMatchOffencesAllWithSameOffenceCodeNoMatchesFoundPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-15", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-22", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-29", resultCodes: ["1002"] })
    ]

    const pncOffences: PncOffence[] = []

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("should testMatchOffencesAllWithSameOffenceCodeUnmatchedPNCOffencesPNCOffencesAreCourtOnes", () => {
    const hoOffences = [createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] })]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "29092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "22092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "15092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toStrictEqual([{ pncOffence: pncOffences[3], hoOffence: hoOffences[0] }])
  })

  it("should testMatchOffencesAllWithSameOffenceCodeUnmatchedPNCOffenceWithFinalResult", () => {
    const hoOffences = [createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] })]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24031", startDate: "08092009", disposalCodes: [4321] }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toStrictEqual([{ pncOffence: pncOffences[1], hoOffence: hoOffences[0] }])
  })

  it("should testMatchOffencesAllWithSameOffenceCodeDuplicateHOOffencesPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "15092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })
    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContain(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContain(hoOffences[1])
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("should testMatchOffencesDifferentOffenceCodesAllOutcomesFoundPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] }),
      createHOOffence({ reason: "031", startDate: "2009-09-08", resultCodes: ["1003"] })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24031", startDate: "08092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24028", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContain(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContain(hoOffences[1])
    expect(outcome.matchedOffences).toStrictEqual([{ pncOffence: pncOffences[1], hoOffence: hoOffences[2] }])
  })

  it("should testMatchIdenticalOffencesPreservingPreviousMatchPNCOffencesAreCourtOnesPNCOffencesAreCourtOnes", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        sequenceNumber: 1
      }),
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        sequenceNumber: 2
      }),
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        sequenceNumber: 3
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 3 }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 2 }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 1 })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(3)

    outcome.matchedOffences.forEach((match) => {
      expect(match.hoOffence.CriminalProsecutionReference.OffenceReasonSequence).toEqual(
        match.pncOffence.offence.sequenceNumber.toString()
      )
    })
  })

  it("should testMatchIdenticalOffencesPreservingPreviousMatchPNCOffencesAreCourtOnesPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"], sequenceNumber: 1 }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"], sequenceNumber: 2 }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"], sequenceNumber: 3 })
    ]

    const pncOffences = [
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 3 }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 2 }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009", sequenceNumber: 1 })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(3)

    outcome.matchedOffences.forEach((match) => {
      expect(match.hoOffence.CriminalProsecutionReference.OffenceReasonSequence).toEqual(
        match.pncOffence.offence.sequenceNumber.toString()
      )
    })
  })

  it("should testMatchOffencesAllWithSameOffenceCodeDuplicateHOOffencesPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] })
    ]

    const pncOffences = [
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "15092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })
    // expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.matchedOffences).toHaveLength(0)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[1])
  })

  it("should testMatchOffencesAllWithSameOffenceCodeMatchesFoundPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-15", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-22", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-29", resultCodes: ["1002"] })
    ]

    const pncOffences = [
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "29092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "22092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "15092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(4)

    expect(outcome.matchedOffences).toContainEqual({ pncOffence: pncOffences[3], hoOffence: hoOffences[0] })
    expect(outcome.matchedOffences).toContainEqual({ pncOffence: pncOffences[2], hoOffence: hoOffences[1] })
    expect(outcome.matchedOffences).toContainEqual({ pncOffence: pncOffences[1], hoOffence: hoOffences[2] })
    expect(outcome.matchedOffences).toContainEqual({ pncOffence: pncOffences[0], hoOffence: hoOffences[3] })
  })

  it("should testMatchOffencesAllWithSameOffenceCodeNoMatchesFoundPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-15", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-22", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-29", resultCodes: ["1002"] })
    ]

    const outcome = matchOffences(hoOffences, [], { attemptManualMatch: true })
    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
  })

  it("should testMatchOffencesAllWithSameOffenceCodeUnmatchedPNCOffencesPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] })]

    const pncOffences = [
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "29092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "22092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "15092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })
    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toStrictEqual([{ pncOffence: pncOffences[3], hoOffence: hoOffences[0] }])
  })

  it("should testMatchOffencesDifferentOffenceCodesAllOutcomesFoundPNCOffencesArePenaltyOnes", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1002"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"] }),
      createHOOffence({ startDate: "2009-09-08", resultCodes: ["1003"], reason: "031" })
    ]

    const pncOffences = [
      createPNCPenaltyCaseOffence({ offenceCode: "VG24030", startDate: "08092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24031", startDate: "08092009" }),
      createPNCPenaltyCaseOffence({ offenceCode: "VG24028", startDate: "08092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(2)
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[0])
    expect(outcome.duplicateHoOffences).toContainEqual(hoOffences[1])

    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toContainEqual({ hoOffence: hoOffences[2], pncOffence: pncOffences[1] })
  })

  it("should testMatchOffencesSingleBreachButNotSingleCourtCaseDatesDoNotMatch", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" })]
    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.duplicateHoOffences).toHaveLength(0)
    // Expect the offence to be in the list which were matched without taking dates into account.
    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.matchedOffences).toHaveLength(1)
  })

  it("should testMatchOffencesSingleBreachAndSingleCourtCaseDatesDoNotMatch", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" })]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toStrictEqual([{ pncOffence: pncOffences[0], hoOffence: hoOffences[0] }])
  })

  it("should testMatchOffencesBreachButMoreHOOffencesAndSingleCourtCaseDatesDoNotMatch", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      }),
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" })]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.duplicateHoOffences).toHaveLength(0)
    // Expect the offence to be in the list which were matched without taking dates into account.
    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.matchedOffences).toHaveLength(1)
  })

  it("should testMatchOffencesBreachButMorePNCOffencesAndSingleCourtCaseDatesDoNotMatch", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    // Expect the offence to be in the list which were matched without taking dates into account.
    expect(outcome.matchedOffences).toHaveLength(1)
  })

  it("should testMatchOffencesBreachButMultipleHOAndPNCOffencesAndSingleCourtCaseDatesDoNotMatch", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      }),
      createHOOffence({
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" }),
      createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.duplicateHoOffences).toHaveLength(0)
    // Expect the offence to be in the list which were matched without taking dates into account.
    expect(outcome.matchedOffences).toHaveLength(2)
    expect(outcome.allPncOffencesMatched).toBe(true)
  })

  it("should testMatchOffencesSingleBreachAndSingleCourtCaseOffencesDoNotMatch", () => {
    const hoOffences = [
      createHOOffence({
        reason: "031",
        startDate: "2009-09-08",
        resultCodes: ["1002"],
        offenceCategory: "CB"
      })
    ]

    const pncOffences = [createPNCCourtCaseOffence({ offenceCode: "VG24030", startDate: "12092009" })]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(0)
    // RCD470
    // expect(outcome.isSingleBreachOffence()).toBe(true)
  })

  // RCD494 - Behaviour now changed so that one an arbitary match is applied where Ho
  // offences match approximately with at least one pnc offence and the results are the same.
  // This case has one ho offence that approximately matches one PNC offence and the other matches
  // both.

  it("should testMatchOffencesForDefectRCD494PartialApproximateMatch", () => {
    const hoOffences = [
      createHOOffence({ actOrSource: "RT", year: "88", reason: "347", startDate: "1996-12-15", endDate: "2010-10-10" }),
      createHOOffence({ actOrSource: "RT", year: "88", reason: "347", startDate: "1996-12-18", endDate: "1996-12-23" })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "14121996", endDate: "10102010" }),
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "18121996", endDate: "24121996" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.matchedOffences).toHaveLength(2)
  })

  // RCD494 - Behaviour now changed so that one an arbitary match is applied where Ho
  // offences match approximately with at least one pnc offence and the results are the same.
  // This case has one ho offence that approximately matches one PNC offence and the other matches
  // both.
  // Order of PNC offences swapped from previous test to make sure that both offences are still
  // matched.

  it("should testMatchOffencesForDefectRCD494PartialApproximateMatchPNCOffencesSwapped", () => {
    const hoOffences = [
      createHOOffence({ actOrSource: "RT", year: "88", reason: "347", startDate: "1996-12-18", endDate: "1996-12-23" }),
      createHOOffence({ actOrSource: "RT", year: "88", reason: "347", startDate: "1996-12-15", endDate: "2010-10-10" })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "18121996", endDate: "24121996" }),
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "14121996", endDate: "10102010" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.matchedOffences).toHaveLength(2)
  })

  // RCD494 - Behaviour now changed so that one an arbitary match is applied where multiple Ho
  // offences match approximately with at least one pnc offence and the results are the same. In
  // this
  // test both offences should match and as a result all offences should be matched.

  it("should testMatchOffencesForRCD494MultipleApproximateMatchesWithSameResults", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "RT",
        year: "88",
        reason: "347",
        startDate: "1996-12-18",
        endDate: "1996-12-23",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "RT",
        year: "88",
        reason: "347",
        startDate: "1996-12-18",
        endDate: "1996-12-23",
        resultCodes: ["1002"]
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "18121996", endDate: "24121996" }),
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "18121996", endDate: "24121996" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.matchedOffences).toHaveLength(2)
  })

  // RCD494 - Behaviour now changed so that one an arbitary match is applied where multiple Ho
  // offences match approximately with at least one pnc offence and the results are the same. In
  // this
  // test the offences won't match because the results are different in the ho offences.

  it("should testMatchOffencesForRCD494MatchesWithDifferentResults", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "RT",
        year: "88",
        reason: "347",
        startDate: "1996-12-18",
        endDate: "1996-12-23",
        resultCodes: ["1002"]
      }),
      createHOOffence({
        actOrSource: "RT",
        year: "88",
        reason: "347",
        startDate: "1996-12-18",
        endDate: "1996-12-23",
        resultCodes: ["1003"]
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "18121996", endDate: "24121996" }),
      createPNCCourtCaseOffence({ offenceCode: "RT88347", startDate: "18121996", endDate: "24121996" })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { attemptManualMatch: true })
    // Note in this scenario the pnc offences will be set as matched, with no matches, but in the
    // list of duplicate matches

    // expect(outcome.allPncOffencesMatched).toBe(true)
    expect(outcome.matchedOffences).toHaveLength(0)
    expect(outcome.pncOffencesMatchedIncludingDuplicates).toHaveLength(2)
    // expect(outcome.duplicateHoOffences).toHaveLength(2)
  })

  it.skip("should testMatchingAllHOOffencesAddedByCourtAllPNCOffencesHaveFinalResult", () => {
    // final String inputFile =
    //     TestOffenceMatcher.class.getResource("/HOValidatorAmender/Test_Data/").getPath()
    //         + "AnnotatedHO1.xml";
    // XmlConverterTool xct = new XmlConverterTool();
    // FileReader r = null;
    // try {
    //   r = new FileReader(inputFile);
    //   AnnotatedHearingOutcomeStructure aho = xct.convertAnnotatedHOXMLToAnnotatedHO(r);
    //   List hoOffences = aho.getHearingOutcome().getCase().getHearingDefendant().getOffence();
    //   List pncCases = aho.getCXE01().getCourtCases().getCourtCase();
    //   CourtCaseType courtCase = (CourtCaseType) pncCases.get(0);
    //   List pncOffences = courtCase.getOffences().getOffence();
    //   const outcome =
    //       matchOffences(hoOffences, pncOffences, { attemptManualMatch: true });
    //   expect(outcome.allPncOffencesMatched).toBe(true)
    // } finally {
    //   if (r != null) {
    //     r.close();
    //   }
    // }
  })

  it("should testMatchingOfExplicitMatchWhereHOOffencesHaveSameSequenceNumberDifferentCases", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2010-10-10" }),
      createHOOffence({ reason: "031", startDate: "2010-10-11", courtCaseReferenceNumber: "CCR1", sequenceNumber: 1 }),
      createHOOffence({ reason: "032", startDate: "2010-10-11", courtCaseReferenceNumber: "CCR2", sequenceNumber: 1 })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "VG24031", startDate: "11102010", sequenceNumber: 1 })
    ]

    const outcome = matchOffences(hoOffences, pncOffences, { caseReference: "CCR1", attemptManualMatch: true })

    expect(outcome.matchedOffences).toHaveLength(1)
    expect(outcome.matchedOffences).toStrictEqual([{ pncOffence: pncOffences[0], hoOffence: hoOffences[1] }])
  })
})
