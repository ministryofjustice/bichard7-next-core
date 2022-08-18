import getOffenceCode from "../../../../lib/offence/getOffenceCode"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import matchOffencesWithSameOffenceCode from "./matchOffencesWithSameOffenceCode"
import matchUnmatchedBreachesWithoutUsingDates from "./matchUnmatchedBreachesWithoutUsingDates"
import mergeOffenceMatcherOutcomes from "./mergeOffenceMatcherOutcomes"
import offenceHasFinalResult from "./offenceHasFinalResult"
import offenceIsBreach from "./offenceIsBreach"
import offencesMatch from "./offencesMatch"

type OffenceMatcherOptions = {
  attemptManualMatch?: boolean
  caseReference?: string
  hearingDate?: Date
}

type OffenceMatch = {
  hoOffence: Offence
  pncOffence: PncOffence
}

type OffenceMatcherOutcome = {
  allPncOffencesMatched: boolean
  duplicateHoOffences: Offence[]
  matchedOffences: OffenceMatch[]
  pncOffencesMatchedIncludingDuplicates: PncOffence[]
  nonMatchingExplicitMatches: OffenceMatch[]
}

const hoResultMatchesPncAdjudication = (hoOffence: Offence, pncOffence: PncOffence, hearingDate?: Date): boolean => {
  const hasPncAdjudication = !!pncOffence.adjudication
  const hoConvictionDate = hoOffence.ConvictionDate
  return (
    (!hoConvictionDate && !hasPncAdjudication) ||
    (!!hoConvictionDate &&
      !!hearingDate &&
      ((hoConvictionDate >= hearingDate && !hasPncAdjudication) ||
        (hoConvictionDate < hearingDate && hasPncAdjudication)))
  )
}

export const hoOffenceAlreadyMatched = (offence: Offence, outcome: OffenceMatcherOutcome): boolean =>
  outcome.matchedOffences.some(({ hoOffence }) => hoOffence === offence) ||
  outcome.duplicateHoOffences.some((hoOffence) => hoOffence === offence)

export const pncOffenceAlreadyMatched = (offence: PncOffence, outcome: OffenceMatcherOutcome): boolean =>
  outcome.matchedOffences.some(({ pncOffence }) => pncOffence === offence) ||
  outcome.pncOffencesMatchedIncludingDuplicates.some((pncOffence) => pncOffence === offence)

export const getHoOffencesByOffenceCode = (hoOffences: Offence[]) =>
  hoOffences.reduce((acc: { [key: string]: Offence[] }, hoOffence) => {
    const offenceCode = getOffenceCode(hoOffence)
    if (!offenceCode) {
      return acc
    }

    if (!acc[offenceCode]) {
      acc[offenceCode] = []
    }

    acc[offenceCode].push(hoOffence)

    return acc
  }, {})

export const getPncOffencesByOffenceCode = (pncOffences: PncOffence[]) =>
  pncOffences.reduce((acc: { [key: string]: PncOffence[] }, pncOffence) => {
    const offenceCode = pncOffence.offence.cjsOffenceCode
    if (!offenceCode) {
      return acc
    }

    if (!acc[offenceCode]) {
      acc[offenceCode] = []
    }

    acc[offenceCode].push(pncOffence)

    return acc
  }, {})

const matchOffences = (
  hoOffences: Offence[],
  pncOffences: PncOffence[],
  { attemptManualMatch, caseReference, hearingDate }: OffenceMatcherOptions
): OffenceMatcherOutcome => {
  let result: OffenceMatcherOutcome = {
    allPncOffencesMatched: true,
    duplicateHoOffences: [],
    matchedOffences: [],
    pncOffencesMatchedIncludingDuplicates: [],
    nonMatchingExplicitMatches: []
  }

  const applyMultipleCourtCaseMatchingLogic = !caseReference && !!hearingDate
  const excludedPncOffences: PncOffence[] = []
  let filteredHoOffences = hoOffences

  if (attemptManualMatch) {
    if (caseReference) {
      filteredHoOffences = hoOffences.filter(
        (hoOffence) =>
          !hoOffence.CourtCaseReferenceNumber ||
          (hoOffence.CourtCaseReferenceNumber && hoOffence.CourtCaseReferenceNumber === caseReference)
      )
    }

    pncOffences.forEach((pncOffence) => {
      const pncSequence = pncOffence.offence.sequenceNumber
      let matchingExplicitMatch: Offence | undefined = undefined
      let pncAdjudicationMatches = false

      for (const hoOffence of filteredHoOffences) {
        if (matchingExplicitMatch || hoOffenceAlreadyMatched(hoOffence, result)) {
          continue
        }

        const sequenceValue = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
        const hoSequence = sequenceValue ? Number(sequenceValue) : undefined

        if (hoSequence !== undefined && hoSequence === pncSequence) {
          if (offencesMatch(hoOffence, pncOffence)) {
            matchingExplicitMatch = hoOffence
          } else {
            result.nonMatchingExplicitMatches.push({ hoOffence, pncOffence })
          }
        } else if (
          applyMultipleCourtCaseMatchingLogic &&
          !pncAdjudicationMatches &&
          offencesMatch(hoOffence, pncOffence) &&
          hoResultMatchesPncAdjudication(hoOffence, pncOffence, hearingDate)
        ) {
          pncAdjudicationMatches = true
        }
      }

      if (matchingExplicitMatch) {
        result.matchedOffences.push({ hoOffence: matchingExplicitMatch, pncOffence })
        result.pncOffencesMatchedIncludingDuplicates.push(pncOffence)
        excludedPncOffences.push(pncOffence)
      } else if (applyMultipleCourtCaseMatchingLogic && !pncAdjudicationMatches) {
        excludedPncOffences.push(pncOffence)
      }
    })
  }

  const remainingHoOffences = filteredHoOffences.filter((hoOffence) => !hoOffenceAlreadyMatched(hoOffence, result))
  const remainingPncOffences = pncOffences.filter(
    (pncOffence) => !pncOffenceAlreadyMatched(pncOffence, result) && !excludedPncOffences.includes(pncOffence)
  )
  const hoOffencesByCode = getHoOffencesByOffenceCode(remainingHoOffences)
  const pncOffencesByCode = getPncOffencesByOffenceCode(remainingPncOffences)
  const offenceCodes = new Set(Object.keys(hoOffencesByCode).concat(Object.keys(pncOffencesByCode)))

  offenceCodes.forEach((offenceCode) => {
    const matchOffencesOutcome = matchOffencesWithSameOffenceCode(
      hoOffencesByCode[offenceCode],
      pncOffencesByCode[offenceCode],
      applyMultipleCourtCaseMatchingLogic
    )

    result = mergeOffenceMatcherOutcomes(result, matchOffencesOutcome)
  })

  const breachOffences = filteredHoOffences
    .filter((hoOffence) => !hoOffenceAlreadyMatched(hoOffence, result))
    .filter(offenceIsBreach)

  const unmatchedPncOffences = remainingPncOffences.filter(
    (pncOffence) => !pncOffenceAlreadyMatched(pncOffence, result)
  )

  if (breachOffences.length > 0 && unmatchedPncOffences.length > 0) {
    const breachOutcome = matchUnmatchedBreachesWithoutUsingDates(
      result,
      breachOffences,
      unmatchedPncOffences,
      applyMultipleCourtCaseMatchingLogic
    )

    result = mergeOffenceMatcherOutcomes(result, breachOutcome)
  }

  result.allPncOffencesMatched =
    pncOffences
      .filter((pncOffence) => !pncOffenceAlreadyMatched(pncOffence, result))
      .filter((pncOffence) => !offenceHasFinalResult(pncOffence)).length === 0

  return result
}

export { matchOffences, OffenceMatch, OffenceMatcherOutcome }
