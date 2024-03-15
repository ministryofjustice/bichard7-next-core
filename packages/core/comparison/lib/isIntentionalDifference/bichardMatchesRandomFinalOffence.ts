import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../types/ExceptionCode"
import OffenceMatcher from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/OffenceMatcher"
import {
  flattenCases,
  type PncOffenceWithCaseRef
} from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/matchOffencesToPnc"
import offenceHasFinalResult from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// Bichard arbitrarily matches offences if the
// PNC offences all have a final disposal.

// <unverified>
// This causes exceptions to be raised at Phase 3
// because the PNC record can't be updated by Bichard.
// </unverified>

// Core raises a 304 in Phase 1 to inform users
// early that the update must be made manually.

const bichardMatchesRandomFinalOffence = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  _: AnnotatedHearingOutcome,
  incomingAho: AnnotatedHearingOutcome
): boolean => {
  const coreRaisesHo100304 =
    "exceptions" in actual && actual.exceptions.some((exception) => exception.code === ExceptionCode.HO100304)
  const bichardMatches = !("exceptions" in expected)

  if (!bichardMatches || !coreRaisesHo100304) {
    return false
  }

  const caseElem = incomingAho.AnnotatedHearingOutcome.HearingOutcome.Case
  const hearingDate = incomingAho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
  const hoOffences = caseElem.HearingDefendant.Offence
  const courtCases = expectedAho.PncQuery?.courtCases
  const penaltyCases = expectedAho.PncQuery?.penaltyCases
  const pncOffences = flattenCases(courtCases).concat(flattenCases(penaltyCases))

  const offenceMatcher = new OffenceMatcher(hoOffences, pncOffences, hearingDate)
  offenceMatcher.findCandidates()
  const groups = offenceMatcher.groupOffences()

  const bichardPicksAtRandom = groups.some((group) => {
    const groupHoOffences = group.reduce((acc, candidate) => {
      acc.add(candidate.hoOffence)
      return acc
    }, new Set<Offence>())

    const groupPncOffences = group.reduce((acc, candidate) => {
      acc.add(candidate.pncOffence)
      return acc
    }, new Set<PncOffenceWithCaseRef>())

    const pncOffencesAreFinal = Array.from(groupPncOffences.values()).some((o) => offenceHasFinalResult(o.pncOffence))

    return pncOffencesAreFinal && groupPncOffences.size > groupHoOffences.size
  })

  return bichardPicksAtRandom
}

export default bichardMatchesRandomFinalOffence
