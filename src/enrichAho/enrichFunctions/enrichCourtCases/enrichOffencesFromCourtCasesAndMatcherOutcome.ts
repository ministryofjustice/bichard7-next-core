import type { MultipleCaseMatcherOutcome } from "src/enrichAho/enrichFunctions/enrichCourtCases/matchMultipleCases"
import offenceIsBreach from "src/enrichAho/enrichFunctions/enrichCourtCases/offenceMatcher/offenceIsBreach"
import offencesMatch from "src/enrichAho/enrichFunctions/enrichCourtCases/offenceMatcher/offencesMatch"
import errorPaths from "src/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCourtCase } from "src/types/PncQueryResult"
import addError from "./addError"
import addNullCourtCaseReferenceNumber from "./addNullCourtCaseReferenceNumber"
import addNullOffenceReasonSequence from "./addNullOffenceReasonSequence"
import offenceCategoryIsNonRecordable from "./offenceCategoryIsNonRecordable"

const getFirstMatchingCourtCaseWith2060Result = (
  pncCases: PncCourtCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
): string | undefined => {
  for (const pncCase of pncCases) {
    for (const pncOffence of pncCase.offences) {
      for (const matchedOffence of matcherOutcome.matchedOffences.keys()) {
        if (matcherOutcome.matchedOffences.get(matchedOffence) === pncOffence) {
          for (const result of matchedOffence.Result) {
            if (result.CJSresultCode === 2060) {
              return pncCase.courtCaseReference
            }
          }
        }
      }
    }
  }
}

const getFirstMatchingCourtCaseWithoutAdjudications = (
  pncCases: PncCourtCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
): string | undefined => {
  for (const pncCase of pncCases) {
    let noAdjudications = true
    let matchFound = false
    for (const pncOffence of pncCase.offences) {
      if ([...matcherOutcome.matchedOffences.values()].includes(pncOffence)) {
        matchFound = true
      }
      if (pncOffence.adjudication) {
        noAdjudications = false
      }
    }
    if (noAdjudications && matchFound) {
      return pncCase.courtCaseReference
    }
  }
}

const getFirstMatchingCourtCase = (
  pncCases: PncCourtCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
): string | undefined => {
  for (const pncCase of pncCases) {
    for (const pncOffence of pncCase.offences) {
      if ([...matcherOutcome.matchedOffences.values()].includes(pncOffence)) {
        return pncCase.courtCaseReference
      }
    }
  }
}

const enrichOffencesFromCourtCasesAndMatcherOutcome = (
  aho: AnnotatedHearingOutcome,
  cases: PncCourtCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
) => {
  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  let matchingCCR: string | undefined

  hoOffences.forEach((hoOffence, offenceIndex) => {
    let offenceHasError = false

    const pncOffence = matcherOutcome.matchedOffences.get(hoOffence)

    if (!pncOffence) {
      const duplicateCases = matcherOutcome.duplicateHoOffences.get(hoOffence)
      if (duplicateCases && duplicateCases.length === 1) {
        addError(aho, ExceptionCode.HO100310, errorPaths.offence(offenceIndex).reasonSequence)
        addNullOffenceReasonSequence(hoOffence)
        addNullCourtCaseReferenceNumber(hoOffence)
        offenceHasError = true
      } else if (
        matcherOutcome.ambiguousHoOffences.includes(hoOffence) ||
        (duplicateCases && duplicateCases.length > 1)
      ) {
        addError(aho, ExceptionCode.HO100332, errorPaths.offence(offenceIndex).reasonSequence)
        addNullOffenceReasonSequence(hoOffence)
        addNullCourtCaseReferenceNumber(hoOffence)
        offenceHasError = true
      } else if (!duplicateCases) {
        if (offenceCategoryIsNonRecordable(hoOffence)) {
          const courtCase = cases[0]
          const courtCaseRef = courtCase.courtCaseReference
          hoOffence.CourtCaseReferenceNumber = courtCaseRef
          hoOffence.AddedByTheCourt = true
          hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
        } else {
          if (!matchingCCR) {
            matchingCCR =
              getFirstMatchingCourtCaseWith2060Result(cases, matcherOutcome) ||
              getFirstMatchingCourtCaseWithoutAdjudications(cases, matcherOutcome) ||
              getFirstMatchingCourtCase(cases, matcherOutcome)
          }

          if (matchingCCR) {
            hoOffence.CourtCaseReferenceNumber = matchingCCR
            hoOffence.AddedByTheCourt = true
            hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
            hoOffence.Result.forEach((result) => {
              result.PNCAdjudicationExists = false
            })
          } else {
            addError(aho, ExceptionCode.HO100332, errorPaths.offence(offenceIndex).reasonSequence)
            addNullOffenceReasonSequence(hoOffence)
            addNullCourtCaseReferenceNumber(hoOffence)
            offenceHasError = true
          }
        }
      }
    } else {
      let courtCaseRef: string | undefined

      cases.forEach((pncCase) => {
        if (pncCase.offences.includes(pncOffence)) {
          courtCaseRef = pncCase.courtCaseReference
        }
      })

      const pncRefNo = pncOffence.offence.sequenceNumber
      const pncOffenceMatches = offencesMatch(hoOffence, pncOffence)

      if (!pncOffenceMatches) {
        addError(aho, ExceptionCode.HO100320, errorPaths.offence(offenceIndex).reasonSequence)
        offenceHasError = true
      } else if (
        !!hoOffence.ManualCourtCaseReferenceNumber &&
        hoOffence.ManualCourtCaseReferenceNumber !== "" &&
        hoOffence.ManualCourtCaseReferenceNumber !== courtCaseRef
      ) {
        addError(aho, ExceptionCode.HO100332, errorPaths.offence(offenceIndex).reasonSequence)
        addNullOffenceReasonSequence(hoOffence)
        offenceHasError = true
      } else {
        if (Number(hoOffence.CriminalProsecutionReference.OffenceReasonSequence) !== pncRefNo) {
          hoOffence.ManualSequenceNumber = undefined
        }
        hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncRefNo.toString()
        hoOffence.CourtCaseReferenceNumber = courtCaseRef

        if (offenceIsBreach(hoOffence)) {
          hoOffence.ActualOffenceStartDate.StartDate = pncOffence.offence.startDate
          if (pncOffence.offence.endDate) {
            hoOffence.ActualOffenceEndDate = { EndDate: pncOffence.offence.endDate }
          }
        }
      }

      if (!offenceHasError && matcherOutcome) {
        const adjudicationExists = !!pncOffence.adjudication
        hoOffence.Result.forEach((result) => (result.PNCAdjudicationExists = adjudicationExists))
      }
    }
  })
}

export default enrichOffencesFromCourtCasesAndMatcherOutcome
