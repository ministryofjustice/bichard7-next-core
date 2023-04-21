import type { CourtResultMatchingSummary, OffenceMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"

// const groupOffences = (offences: OffenceMatchingSummary[]): Record<string, number[]> =>
//   offences.reduce((acc: Record<string, number[]>, offence) => {
//     if (!offence.offenceCode || offence.addedByCourt) {
//       return acc
//     }

//     if (!(offence.offenceCode in acc)) {
//       acc[offence.offenceCode] = []
//     }

//     acc[offence.offenceCode].push(offence.hoSequenceNumber)
//     return acc
//   }, {})

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
  actual: CourtResultMatchingSummary
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
