import errorPaths from "core/phase1/src/lib/errorPaths"
import type { AnnotatedHearingOutcome, Offence } from "core/phase1/src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "core/phase1/src/types/ExceptionCode"
import type { PncCourtCase, PncOffence, PncPenaltyCase, PncQueryResult } from "core/phase1/src/types/PncQueryResult"
import OffenceMatcher from "./OffenceMatcher"
import annotatePncMatch, { CaseType } from "./annotatePncMatch"
import offenceCategoryIsNonRecordable from "./offenceCategoryIsNonRecordable"
import offenceHasFinalResult from "./offenceHasFinalResult"

export type PncOffenceWithCaseRef = {
  caseReference: string
  caseType: CaseType
  pncOffence: PncOffence
}

export type OffenceMatch = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
}

const matchingCourtCases = (cases: PncCourtCase[], pncOffences: PncOffenceWithCaseRef[]): PncCourtCase[] =>
  cases.filter((courtCase) =>
    pncOffences.some((pncOffence) => pncOffence.caseReference === courtCase.courtCaseReference)
  )

const getCaseByReference = (pncQuery: PncQueryResult, reference: string): PncCourtCase | PncPenaltyCase => {
  if (pncQuery.courtCases) {
    for (const courtCase of pncQuery.courtCases) {
      if (courtCase.courtCaseReference === reference) {
        return courtCase
      }
    }
  }
  if (pncQuery.penaltyCases) {
    for (const penaltyCase of pncQuery.penaltyCases) {
      if (penaltyCase.penaltyCaseReference === reference) {
        return penaltyCase
      }
    }
  }
  throw new Error("Could not find case by reference")
}

const getFirstMatchingCourtCaseWith2060Result = (
  cases: PncCourtCase[],
  offenceMatcher: OffenceMatcher
): string | undefined => {
  const matchedCases = matchingCourtCases(cases, offenceMatcher.matchedPncOffences)
  const matchedCasesWith2060Result = matchedCases.filter((courtCase) =>
    courtCase.offences.some((pncOffence) =>
      [...offenceMatcher.matches.entries()].some(
        ([matchedHoOffence, matchedPncOffence]) =>
          matchedPncOffence.pncOffence === pncOffence &&
          matchedHoOffence.Result.some((result) => result.CJSresultCode === 2060)
      )
    )
  )
  return matchedCasesWith2060Result[0]?.courtCaseReference
}

const getFirstMatchingCourtCaseWithoutAdjudications = (
  cases: PncCourtCase[],
  offenceMatcher: OffenceMatcher
): string | undefined => {
  const matchedCases = matchingCourtCases(cases, offenceMatcher.matchedPncOffences)
  const matchedCasesWithNoAdjudications = matchedCases.filter((courtCase) =>
    courtCase.offences.every((pncOffence) => !pncOffence.adjudication)
  )
  return matchedCasesWithNoAdjudications[0]?.courtCaseReference
}

const getFirstMatchingCourtCase = (cases: PncCourtCase[], offenceMatcher: OffenceMatcher): string | undefined =>
  matchingCourtCases(cases, offenceMatcher.matchedPncOffences)[0]?.courtCaseReference

export const pushToArrayInMap = <K, V>(map: Map<K, V[]>, key: K, ...items: V[]) => {
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key)!.push(...items)
}

const getCaseReference = (pncCase: PncCourtCase | PncPenaltyCase): string => {
  if ("courtCaseReference" in pncCase) {
    return pncCase.courtCaseReference
  }
  return pncCase.penaltyCaseReference
}

const getCaseType = (pncCase: PncCourtCase | PncPenaltyCase): CaseType =>
  "courtCaseReference" in pncCase ? CaseType.court : CaseType.penalty

const flattenCases = (courtCases: PncCourtCase[] | PncPenaltyCase[] | undefined): PncOffenceWithCaseRef[] =>
  courtCases
    ?.map((cc) =>
      cc.offences.map((o) => ({ pncOffence: o, caseReference: getCaseReference(cc), caseType: getCaseType(cc) }))
    )
    .flat() ?? []

const matchOffencesToPnc = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  const caseElem = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  const hearingDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
  const hoOffences = caseElem.HearingDefendant.Offence
  const courtCases = aho.PncQuery?.courtCases
  const penaltyCases = aho.PncQuery?.penaltyCases
  const pncOffences = flattenCases(courtCases).concat(flattenCases(penaltyCases))

  if (!aho.PncQuery || pncOffences.length === 0 || hoOffences.length === 0) {
    return aho
  }

  const offenceMatcher = new OffenceMatcher(hoOffences, pncOffences, hearingDate)
  offenceMatcher.match()

  if (offenceMatcher.hasExceptions) {
    aho.Exceptions.push(...offenceMatcher.exceptions)
    return aho
  }

  // If there are still any unmatched PNC offences that don't already have final results in the court cases we have matched, raise an exception
  const matchedCases = offenceMatcher.matchedPncOffences.reduce((acc, pncOffence) => {
    acc.add(getCaseByReference(aho.PncQuery!, pncOffence.caseReference))
    return acc
  }, new Set<PncCourtCase | PncPenaltyCase>())

  const matchedCourtCases = Array.from(matchedCases.values()).filter(
    (matchedCase) => "courtCaseReference" in matchedCase
  )
  const matchedPenaltyCases = Array.from(matchedCases.values()).filter(
    (matchedCase) => "penaltyCaseReference" in matchedCase
  )

  if (matchedCourtCases.length > 0 && matchedPenaltyCases.length > 0) {
    aho.Exceptions.push({ code: ExceptionCode.HO100328, path: errorPaths.case.asn })
    return aho
  }

  if (matchedPenaltyCases.length > 0 && offenceMatcher.matches.size > 1) {
    aho.Exceptions.push({ code: ExceptionCode.HO100329, path: errorPaths.case.asn })
    return aho
  }

  const unmatchedNonFinalPncOffences = pncOffences.filter(
    (pncOffence) =>
      Array.from(matchedCases).some((matchedCase) => getCaseReference(matchedCase) === pncOffence.caseReference) &&
      !offenceHasFinalResult(pncOffence.pncOffence) &&
      offenceMatcher.unmatchedPncOffences.includes(pncOffence)
  )

  if (unmatchedNonFinalPncOffences.length > 0) {
    aho.Exceptions.push({ code: ExceptionCode.HO100304, path: errorPaths.case.asn })
    return aho
  }

  if (matchedCourtCases.length > 0 && courtCases) {
    // Check whether we have matched more than one court case
    const multipleMatches = matchedCases.size > 1
    // Annotate the AHO with the matches
    offenceMatcher.matches.forEach((pncOffence, hoOffence) =>
      annotatePncMatch({ hoOffence, pncOffence }, caseElem, multipleMatches, CaseType.court)
    )

    // Add offences in court
    offenceMatcher.unmatchedHoOffences.forEach((hoOffence) => {
      hoOffence.AddedByTheCourt = true
      hoOffence.ManualCourtCaseReference = undefined
      hoOffence.CourtCaseReferenceNumber = undefined

      if (multipleMatches) {
        // TODO: We need to come back and understand the logic for which court case to allocate the new offence to
        if (offenceCategoryIsNonRecordable(hoOffence)) {
          hoOffence.CourtCaseReferenceNumber = courtCases[0].courtCaseReference
        } else {
          hoOffence.CourtCaseReferenceNumber =
            getFirstMatchingCourtCaseWith2060Result(courtCases, offenceMatcher) ||
            getFirstMatchingCourtCaseWithoutAdjudications(courtCases, offenceMatcher) ||
            getFirstMatchingCourtCase(courtCases, offenceMatcher)
        }
      }
      hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
      if (!multipleMatches || !offenceCategoryIsNonRecordable(hoOffence)) {
        // TODO: When we're not trying to maintain compatibility with Bichard, all offences added by the court should have this set to false
        hoOffence.Result.forEach((result) => {
          result.PNCAdjudicationExists = false
        })
      }
    })
  }

  if (matchedPenaltyCases.length > 0) {
    if (offenceMatcher.unmatchedHoOffences.length > 0) {
      aho.Exceptions.push({ code: ExceptionCode.HO100507, path: errorPaths.case.asn })
      return aho
    }

    offenceMatcher.matches.forEach((pncOffence, hoOffence) =>
      annotatePncMatch({ hoOffence, pncOffence }, caseElem, false, CaseType.penalty)
    )
  }

  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = aho.PncQuery?.pncId
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCCheckname = aho.PncQuery?.checkName

  return aho
}

export default matchOffencesToPnc
