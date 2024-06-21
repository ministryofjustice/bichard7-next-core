import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary, OffenceMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import hoOffencesAreEqual from "../hoOffencesAreEqual"

const groupIdenticalOffences = (offences: Offence[]): Offence[][] => {
  const output = []
  for (const offence of offences) {
    let found = false
    for (const group of output) {
      const otherOffence = group[0]
      if (hoOffencesAreEqual(offence, otherOffence)) {
        group.push(offence)
        found = true
        break
      }
    }

    if (!found) {
      output.push([offence])
    }
  }

  return output
}

const groupOffences = (offences: Offence[], matches: OffenceMatchingSummary[]): string[][] => {
  const identicalOffenceGroups = groupIdenticalOffences(offences)
  return identicalOffenceGroups.map((group) =>
    group.map((hoOffence) => {
      const matchedOffence = matches.find((match) => match.hoSequenceNumber === hoOffence.CourtOffenceSequenceNumber)
      return `${matchedOffence?.courtCaseReference}/${matchedOffence?.pncSequenceNumber}`
    })
  )
}

const identicalOffenceSwitchedSequenceNumbers = ({ expected, actual }: ComparisonData): boolean => {
  const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
  const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

  if ("exceptions" in actualMatchingSummary || "exceptions" in expectedMatchingSummary) {
    return false
  }

  const expectedHoOffences = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const expectedOffenceGroups = groupOffences(expectedHoOffences, expectedMatchingSummary.offences)
  const actualHoOffences = actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const actualOffenceGroups = groupOffences(actualHoOffences, actualMatchingSummary.offences)
  const differenceBeforeSort = JSON.stringify(expectedOffenceGroups) !== JSON.stringify(actualOffenceGroups)

  expectedOffenceGroups.forEach((group) => group.sort())
  actualOffenceGroups.forEach((group) => group.sort())

  return differenceBeforeSort && JSON.stringify(expectedOffenceGroups) === JSON.stringify(actualOffenceGroups)
}

export default identicalOffenceSwitchedSequenceNumbers
