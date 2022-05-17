import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import getOffenceCode from "src/utils/offence/getOffenceCode"
import matchOffencesWithSameOffenceCode from "./matchOffencesWithSameOffenceCode"
import mergeOffenceMatcherOutcomes from "./mergeOffenceMatcherOutcomes"
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
  outcome.matchedOffences.some(({ hoOffence }) => hoOffence === offence) &&
  !outcome.duplicateHoOffences.some((hoOffence) => hoOffence === offence)

export const pncOffenceAlreadyMatched = (offence: PncOffence, outcome: OffenceMatcherOutcome): boolean =>
  outcome.matchedOffences.some(({ pncOffence }) => pncOffence === offence)

const getHoOffencesByOffenceCode = (hoOffences: Offence[]) =>
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

const getPncOffencesByOffenceCode = (pncOffences: PncOffence[]) =>
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
  console.log(attemptManualMatch)
  console.log(pncOffenceAlreadyMatched)
  let result: OffenceMatcherOutcome = {
    allPncOffencesMatched: false,
    duplicateHoOffences: [],
    matchedOffences: [],
    pncOffencesMatchedIncludingDuplicates: [],
    nonMatchingExplicitMatches: []
  }

  const applyMultipleCourtCaseMatchingLogic = !caseReference && !!hearingDate
  const filteredHoOffences = hoOffences

  if (caseReference) {
    hoOffences = hoOffences.filter(
      (hoOffence) => hoOffence.CourtCaseReferenceNumber && hoOffence.CourtCaseReferenceNumber === caseReference
    )
  }

  pncOffences.forEach((pncOffence) => {
    const pncSequence = pncOffence.offence.sequenceNumber
    let matchingExplicitMatch: Offence
    let pncAdjudicationMatches = false

    filteredHoOffences.forEach((hoOffence) => {
      if (hoOffenceAlreadyMatched(hoOffence, result)) {
        return
      }

      const hoSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
      if (hoSequence !== undefined && hoSequence === pncSequence && !matchingExplicitMatch) {
        if (offencesMatch(hoOffence, pncOffence)) {
          matchingExplicitMatch = hoOffence
        } else {
          result.nonMatchingExplicitMatches.push({ hoOffence, pncOffence })
        }
      } else if (
        applyMultipleCourtCaseMatchingLogic &&
        !matchingExplicitMatch &&
        !pncAdjudicationMatches &&
        offencesMatch(hoOffence, pncOffence) &&
        hoResultMatchesPncAdjudication(hoOffence, pncOffence, hearingDate)
      ) {
        pncAdjudicationMatches = true
      }

      if (matchingExplicitMatch) {
        result.matchedOffences.push({ hoOffence, pncOffence })
        result.pncOffencesMatchedIncludingDuplicates.push(pncOffence)
      }
    })
  })

  const hoOffencesByCode = getHoOffencesByOffenceCode(hoOffences)
  const pncOffencesByCode = getPncOffencesByOffenceCode(pncOffences)
  const offenceCodes = new Set(Object.keys(hoOffencesByCode).concat(Object.keys(pncOffencesByCode)))

  offenceCodes.forEach((offenceCode) => {
    const matchOffencesOutcome = matchOffencesWithSameOffenceCode(
      hoOffencesByCode[offenceCode],
      pncOffencesByCode[offenceCode],
      applyMultipleCourtCaseMatchingLogic
    )

    result = mergeOffenceMatcherOutcomes(result, matchOffencesOutcome)
  })

  // Remember to skip PNC offences that haven't been matched but have been removed

  result.allPncOffencesMatched = result.matchedOffences.length === pncOffences.length

  return result
}

export { matchOffences, OffenceMatch, OffenceMatcherOutcome }
