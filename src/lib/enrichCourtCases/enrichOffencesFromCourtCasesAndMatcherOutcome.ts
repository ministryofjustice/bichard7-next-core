import type { MultipleCaseMatcherOutcome } from "src/lib/matchMultipleCases"
import offenceIsBreach from "src/lib/offenceMatcher/offenceIsBreach"
import offencesMatch from "src/lib/offenceMatcher/offencesMatch"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCase } from "src/types/PncQueryResult"
import addError from "./addError"
import offenceCategoryIsNonRecordable from "./offenceCategoryIsNonRecordable"

const getFirstMatchingCourtCaseWith2060Result = (
  pncCases: PncCase[],
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
  pncCases: PncCase[],
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
  pncCases: PncCase[],
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
  cases: PncCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
) => {
  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  let matchingCCR: string | undefined

  hoOffences.forEach((hoOffence) => {
    let offenceHasError = false

    const pncOffence = matcherOutcome.matchedOffences.get(hoOffence)

    if (!pncOffence) {
      const duplicateCases = matcherOutcome.duplicateHoOffences.get(hoOffence)
      if (duplicateCases && duplicateCases.length === 1) {
        addError(aho, ExceptionCode.HO100310, ["path", "to", "duplicate"])
        offenceHasError = true
      } else if (
        matcherOutcome.ambiguousHoOffences.includes(hoOffence) ||
        (duplicateCases && duplicateCases.length > 1)
      ) {
        addError(aho, ExceptionCode.HO100332, ["path", "to", "duplicate"])
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
            addError(aho, ExceptionCode.HO100332, ["path", "to", "offenceReasonSequenceNumber"])
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
        addError(aho, ExceptionCode.HO100320, ["path", "to", "offenceReasonSequence"])
        offenceHasError = true
      } else if (
        !!hoOffence.ManualCourtCaseReferenceNumber &&
        hoOffence.ManualCourtCaseReferenceNumber !== "" &&
        hoOffence.ManualCourtCaseReferenceNumber !== courtCaseRef
      ) {
        addError(aho, ExceptionCode.HO100332, ["path", "to", "offenceReasonSequence"])
        offenceHasError = true
      } else {
        if (hoOffence.CriminalProsecutionReference.OffenceReasonSequence !== pncRefNo) {
          hoOffence.ManualSequenceNumber = undefined
        }
        hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncRefNo
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
