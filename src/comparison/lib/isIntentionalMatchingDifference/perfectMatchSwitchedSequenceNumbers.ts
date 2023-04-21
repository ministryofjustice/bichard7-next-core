import type { CourtResultMatchingSummary, OffenceMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

type MatchGroup = {
  pncRecords: number[]
  hoRecords: number[]
}

type GroupedMatches = Record<string, MatchGroup>

const groupOffences = (offences: OffenceMatchingSummary[]): GroupedMatches => {
  const matches: GroupedMatches = {}
  for (const offence of offences) {
    if (!offence.offenceCode || offence.addedByCourt || !offence.pncSequenceNumber) {
      continue
    }
    if (!(offence.offenceCode in matches)) {
      matches[offence.offenceCode] = { pncRecords: [], hoRecords: [] }
    }
    matches[offence.offenceCode].pncRecords.push(offence.pncSequenceNumber)
    matches[offence.offenceCode].pncRecords.sort()
    matches[offence.offenceCode].hoRecords.push(offence.hoSequenceNumber)
    matches[offence.offenceCode].hoRecords.sort()
  }
  return matches
}

const perfectMatchSwitchedSequenceNumbers = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  _: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual || "exceptions" in expected) {
    return false
  }

  const expectedMatchesActual = JSON.stringify(expected) === JSON.stringify(actual)
  if (expectedMatchesActual) {
    return false
  }

  const expectedMatches = expected.offences.filter(
    (offence) => !offence.addedByCourt && offence.pncSequenceNumber !== undefined
  )
  const actualMatches = actual.offences.filter(
    (offence) => !offence.addedByCourt && offence.pncSequenceNumber !== undefined
  )
  const sameNumberOfMatches = expectedMatches.length === actualMatches.length

  const actualPerfectMatch = actual.offences.every(
    (offence) => offence.hoSequenceNumber === offence.pncSequenceNumber || offence.addedByCourt
  )

  const expectedOffenceGroups = groupOffences(expectedMatches)
  const actualOffenceGroups = groupOffences(actualMatches)
  const hasSameMatches = JSON.stringify(expectedOffenceGroups) === JSON.stringify(actualOffenceGroups)

  return sameNumberOfMatches && actualPerfectMatch && hasSameMatches
}

export default perfectMatchSwitchedSequenceNumbers
