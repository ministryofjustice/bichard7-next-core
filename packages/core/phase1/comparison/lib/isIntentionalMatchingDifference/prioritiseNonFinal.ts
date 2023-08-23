import type { CourtResultMatchingSummary } from "phase1/comparison/types/MatchingComparisonOutput"
import offenceHasFinalResult from "phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type { PncOffence } from "types/PncQueryResult"

type PncOffenceRef = {
  courtRef: string
  sequence: number
}

const generateMatches = (summary: CourtResultMatchingSummary): Map<number, PncOffenceRef> | null => {
  if ("exceptions" in summary) {
    return null
  }

  return summary.offences.reduce((acc: Map<number, PncOffenceRef>, offence) => {
    const courtRef = offence.courtCaseReference ?? summary.caseReference
    if (!courtRef || offence.pncSequenceNumber === undefined) {
      return acc
    }
    acc.set(offence.hoSequenceNumber, { courtRef, sequence: offence.pncSequenceNumber })
    return acc
  }, new Map<number, PncOffenceRef>())
}

const findPncOffence = (aho: AnnotatedHearingOutcome, pncOffenceRef: PncOffenceRef): PncOffence | undefined =>
  aho.PncQuery?.courtCases
    ?.find((cc) => cc.courtCaseReference === pncOffenceRef.courtRef)
    ?.offences.find((offence) => offence.offence.sequenceNumber === pncOffenceRef.sequence)

const prioritiseNonFinal = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual || "exceptions" in expected) {
    return false
  }

  const expectedMatches = generateMatches(expected)
  const actualMatches = generateMatches(actual)

  if (!expectedMatches || !actualMatches) {
    return false
  }

  const expectedHoMatches = Array.from(expectedMatches.keys()).sort()
  const actualHoMatches = Array.from(actualMatches.keys()).sort()

  if (JSON.stringify(expectedHoMatches) !== JSON.stringify(actualHoMatches)) {
    return false
  }

  const offencesWithDifference = Array.from(expectedMatches.keys()).reduce((acc: number[], hoOffenceSequence) => {
    const expectedMatch = expectedMatches.get(hoOffenceSequence)
    const actualMatch = actualMatches.get(hoOffenceSequence)

    if (
      !expectedMatch ||
      !actualMatch ||
      (expectedMatch.courtRef === actualMatch.courtRef && expectedMatch.sequence === actualMatch.sequence)
    ) {
      return acc
    }

    acc.push(hoOffenceSequence)

    return acc
  }, [])

  if (offencesWithDifference.length === 0) {
    return false
  }

  return offencesWithDifference.every((hoOffenceSequence) => {
    const expectedMatch = expectedMatches.get(hoOffenceSequence)
    const actualMatch = actualMatches.get(hoOffenceSequence)
    if (!expectedMatch || !actualMatch) {
      return false
    }

    const expectedPncOffence = findPncOffence(expectedAho, expectedMatch)
    const actualPncOffence = findPncOffence(expectedAho, actualMatch)
    if (!expectedPncOffence || !actualPncOffence) {
      return false
    }
    const expectedOffenceIsFinal = offenceHasFinalResult(expectedPncOffence)
    const actualOffenceIsFinal = offenceHasFinalResult(actualPncOffence)
    const offencesAreEqual =
      expectedPncOffence.offence.cjsOffenceCode === actualPncOffence.offence.cjsOffenceCode &&
      expectedPncOffence.offence.startDate.getTime() === actualPncOffence.offence.startDate.getTime() &&
      expectedPncOffence.offence.endDate?.getTime() === actualPncOffence.offence.endDate?.getTime()

    if (expectedOffenceIsFinal && !actualOffenceIsFinal && offencesAreEqual) {
      return true
    }
    return false
  })
}

export default prioritiseNonFinal
