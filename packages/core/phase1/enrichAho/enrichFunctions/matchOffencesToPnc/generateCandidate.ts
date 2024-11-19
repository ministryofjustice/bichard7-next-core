import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { Candidate } from "../../../enrichAho/enrichFunctions/matchOffencesToPnc/OffenceMatcher"
import type { PncOffenceWithCaseRef } from "../../../enrichAho/enrichFunctions/matchOffencesToPnc/matchOffencesToPnc"
import offenceIsBreach from "../../../enrichAho/enrichFunctions/matchOffencesToPnc/offenceIsBreach"
import getOffenceCode from "../../../lib/offence/getOffenceCode"
import { datesMatchApproximately } from "./datesMatchApproximately"
import { datesMatchExactly } from "./datesMatchExactly"
import { offenceManuallyMatches } from "./offenceManuallyMatches"

const hasManualSequenceMatch = (hoOffence: Offence): boolean =>
  !!hoOffence.ManualSequenceNumber && !!hoOffence.CriminalProsecutionReference.OffenceReasonSequence

const hasManualCcrMatch = (hoOffence: Offence): boolean =>
  !!hoOffence.ManualCourtCaseReference && !!hoOffence.CourtCaseReferenceNumber

const hasManualMatch = (hoOffence: Offence): boolean =>
  hasManualSequenceMatch(hoOffence) || hasManualCcrMatch(hoOffence)

const generateCandidate = (
  hoOffence: Offence,
  pncOffence: PncOffenceWithCaseRef,
  hearingDate: Date
): void | Candidate => {
  const ignoreDates = offenceIsBreach(hoOffence)
  const hoOffenceCode = getOffenceCode(hoOffence)
  const pncOffenceCode = pncOffence.pncOffence.offence.cjsOffenceCode

  if (hoOffenceCode !== pncOffenceCode) {
    return
  }

  const candidate: Candidate = {
    adjudicationMatch: false,
    exactDateMatch: false,
    fuzzyDateMatch: true,
    hoOffence,
    manualCcrMatch: false,
    manualSequenceMatch: false,
    pncOffence
  }

  if (hasManualMatch(hoOffence)) {
    if (offenceManuallyMatches(hoOffence, pncOffence)) {
      candidate.manualSequenceMatch = hasManualSequenceMatch(hoOffence)
      candidate.manualCcrMatch = hasManualCcrMatch(hoOffence)
    } else {
      return
    }
  }

  if (hoOffence.ConvictionDate && pncOffence.pncOffence.adjudication) {
    candidate.adjudicationMatch = hoOffence.ConvictionDate < hearingDate
  } else if (
    (!hoOffence.ConvictionDate || hoOffence.ConvictionDate.getTime() === hearingDate.getTime()) &&
    !pncOffence.pncOffence.adjudication
  ) {
    candidate.adjudicationMatch = true
  }

  if (ignoreDates) {
    return candidate
  }

  if (!datesMatchApproximately(hoOffence, pncOffence.pncOffence)) {
    return
  }

  candidate.exactDateMatch = datesMatchExactly(hoOffence, pncOffence.pncOffence)

  return candidate
}

export default generateCandidate
