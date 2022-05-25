import offenceIsBreach from "src/lib/offenceMatcher/offenceIsBreach"
import type { OffenceMatcherOutcome } from "src/lib/offenceMatcher/offenceMatcher"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncOffence } from "src/types/PncQueryResult"
import addError from "./addError"
import hasDuplicateSequenceNumber from "./hasDuplicateSequenceNumber"

const enrichOffencesFromMatcherOutcome = (aho: AnnotatedHearingOutcome, matcherOutcome?: OffenceMatcherOutcome) => {
  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  hoOffences.forEach((hoOffence) => {
    let offenceHasError = false
    let adjudicationExists = false
    const existingOffenceReasonSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence

    if (!matcherOutcome && existingOffenceReasonSequence !== undefined) {
      addError(aho, ExceptionCode.HO100333, ["path", "to", "error"])
      offenceHasError = true
      hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
      hoOffence.ManualSequenceNumber = undefined
    } else if (hasDuplicateSequenceNumber(hoOffence, hoOffences)) {
      addError(aho, ExceptionCode.HO100311, ["path", "to", "error"])
      offenceHasError = true
    } else {
      // Look for a matched PNC offence - either one which actually matches the HO offence, or one
      // which doesn't
      // match but was explicitly specified by a user-entered offence reason sequence.
      let pncOffence: PncOffence | null = null
      let pncOffenceMatches = false
      if (matcherOutcome) {
        pncOffenceMatches = true
        const matchingPncOffences = matcherOutcome.matchedOffences.filter((match) => match.hoOffence === hoOffence)
        if (matchingPncOffences.length > 1) {
          pncOffence = matchingPncOffences[0].pncOffence
        }
        if (!pncOffence) {
          const nonMatchingPncOffences = matcherOutcome.nonMatchingExplicitMatches.filter(
            (match) => match.hoOffence === hoOffence
          )
          if (nonMatchingPncOffences.length > 1) {
            pncOffence = nonMatchingPncOffences[0].pncOffence
          }
          pncOffenceMatches = false
        }
      }

      // The HO offence matched against a PNC offence (or was a non-matching explict match).
      if (pncOffence) {
        // TODO: This needs to optioanlly handle penalty offences
        const pncRefNo = pncOffence.offence.sequenceNumber
        adjudicationExists = !!pncOffence.adjudication

        // If a manual match has failed and hence the offence has been included in the automatic
        // matching algorithm but
        // there is still no match after attempting automatic matching then we may need to raise
        // an exception to indicate
        // that the manually specified match was invalid as the corresponding PNC offence didn't
        // match. We do this if :-
        //     - there are unmatched PNC offence, meaning that the unmatched HO offence should not
        // be considered to be an
        //       offence added at court or
        //	   - the offence is a duplicate in which case we want explicit match exception rather
        // than duplicate offence
        //       exception
        //	   - there are no PNC matches
        if (
          !pncOffenceMatches &&
          matcherOutcome != null &&
          existingOffenceReasonSequence !== undefined &&
          (matcherOutcome.duplicateHoOffences.includes(hoOffence) ||
            !matcherOutcome.allPncOffencesMatched ||
            matcherOutcome.pncOffencesMatchedIncludingDuplicates.length === 0)
        ) {
          addError(aho, ExceptionCode.HO100320, ["path", "to", "offenceReasonSequence"])
          offenceHasError = true
        } else {
          // Set the offence reason sequence in the HO Offence and clear the ManualSequenceNo
          // flag if the ManualSequenceNo flag is set and the pnc and ho offence sequence numbers
          // do not match. This indicates a failed manual match where a match was detected automatically
          // (i.e. ambiguities addressed by other manual matches).
          if (hoOffence.ManualSequenceNumber !== undefined && pncOffenceMatches) {
            if (hoOffence.CriminalProsecutionReference.OffenceReasonSequence !== pncRefNo) {
              hoOffence.ManualSequenceNumber = undefined
              hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncRefNo
            }
          } else if (pncOffenceMatches) {
            // must have been automatically matched so set the offence reason sequence.
            hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncRefNo
          } else {
            // must be an offence added at court, determined as a result of automatic matching
            // overriding failed manual match
            hoOffence.AddedByTheCourt = true
            hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
            hoOffence.ManualSequenceNumber = undefined
            // By definition adjudication cannot exist on the PNC. This is being set to
            // True if non matching explicit match was specified and the PNC offence contained an adjudication.
            adjudicationExists = false
          }

          // Must null the offence courtCaseReference number as it shouldn't be
          // present when matching against a single court case.
          if (hoOffence.CourtCaseReferenceNumber !== undefined) {
            hoOffence.CourtCaseReferenceNumber = undefined
            hoOffence.ManualCourtCaseReferenceNumber = undefined
          }
        }

        // Set start and end dates in the HO if offence was breach.
        if (offenceIsBreach(hoOffence)) {
          hoOffence.ActualOffenceStartDate.StartDate = pncOffence.offence.startDate
          if (pncOffence.offence.endDate) {
            hoOffence.ActualOffenceEndDate = { EndDate: pncOffence.offence.endDate }
          }
        }
      } else {
        // The HO offence was not matched against a PNC offence:
        // it is added by the court unless it previously had an offence reason sequence which has
        // no counterpart in the PNC message, or it is a duplicate.
        //
        // If a manual match has failed because the manual sequence number is not available on the
        // PNC,and hence the offence has been included in the automatic matching algorithm but there
        // is still no match after attempting automatic matching then we may need to raise an exception
        // to indicate that the manually specified match was invalid as the corresponding PNC offence
        // doesn't exist on the PNC. We do this if :-
        //     - there are unmatched PNC offence, meaning that the unmatched HO offence should not
        // be considered to be an offence added at court or
        //	   - the offence is a duplicate in which case we want explicit match exception rather
        // than duplicate offence exception
        //	   - there are no PNC matches
        if (
          existingOffenceReasonSequence !== undefined &&
          matcherOutcome &&
          (!matcherOutcome.allPncOffencesMatched ||
            matcherOutcome.pncOffencesMatchedIncludingDuplicates.length === 0 ||
            matcherOutcome.duplicateHoOffences.includes(hoOffence))
        ) {
          addError(aho, ExceptionCode.HO100312, ["path", "to", "offenceReasonSequence"])
          offenceHasError = true
        } else if (matcherOutcome && matcherOutcome.duplicateHoOffences.includes(hoOffence)) {
          // Error: Offence is a duplicate
          addError(aho, ExceptionCode.HO100310, ["path", "to", "offenceReasonSequence"])
          offenceHasError = true
        } else {
          // Offence is added by the court"
          hoOffence.AddedByTheCourt = true
          hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
          // set the manual sequence no flag to false as it shouldn't be set if the offence is
          // added at court.
          hoOffence.ManualSequenceNumber = undefined
        }

        // Must null the offence courtCaseReference number as it shouldn't be
        // present when matching against a single court case.
        if (hoOffence.CourtCaseReferenceNumber !== undefined) {
          hoOffence.CourtCaseReferenceNumber = undefined
          hoOffence.ManualCourtCaseReferenceNumber = undefined
        }
      }
    }

    // If no error was detected and a case match was found, set the "adjudication exists" element
    // on all the offence's results.
    if (!offenceHasError && matcherOutcome) {
      hoOffence.Result.forEach((result) => (result.PNCAdjudicationExists = adjudicationExists))
    }
  })
}

export default enrichOffencesFromMatcherOutcome
