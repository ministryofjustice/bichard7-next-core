import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../types/PncQueryResult"
import offenceHasFinalResult from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"

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

const prioritiseNonFinal = ({ expected, actual }: ComparisonData): boolean => {
  const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
  const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

  if ("exceptions" in actualMatchingSummary || "exceptions" in expectedMatchingSummary) {
    return false
  }

  const expectedMatches = generateMatches(expectedMatchingSummary)
  const actualMatches = generateMatches(actualMatchingSummary)

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

    const expectedPncOffence = findPncOffence(expected.aho, expectedMatch)
    const actualPncOffence = findPncOffence(expected.aho, actualMatch)
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
