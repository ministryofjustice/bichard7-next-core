import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"
import { formatFormInputDateString } from "utils/date/formattedDate"

const getAmendmentsByComparison = (aho: AnnotatedHearingOutcome, updatedAho?: AnnotatedHearingOutcome): Amendments => {
  const amendments: Amendments = {}

  if (!updatedAho) {
    return amendments
  }

  const hearingDefendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const updatedHearingDefendant = updatedAho?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant

  if (
    hearingDefendant.ArrestSummonsNumber &&
    updatedHearingDefendant?.ArrestSummonsNumber &&
    hearingDefendant.ArrestSummonsNumber !== updatedHearingDefendant?.ArrestSummonsNumber
  ) {
    amendments.asn = updatedHearingDefendant?.ArrestSummonsNumber
  }

  hearingDefendant.Offence.forEach((offence, offenceIndex) => {
    const updatedOffence = updatedHearingDefendant?.Offence[offenceIndex]
    const updatedOffenceResults = updatedOffence?.Result

    const updatedReasonSequence = Number(updatedOffence?.CriminalProsecutionReference?.OffenceReasonSequence)
    const updatedCourtCaseReferenceNumber = updatedOffence?.CourtCaseReferenceNumber

    if (updatedReasonSequence || updatedOffence?.AddedByTheCourt) {
      amendments.offenceReasonSequence = amendments.offenceReasonSequence || []
      amendments.offenceReasonSequence.push({
        offenceIndex,
        value: updatedOffence?.AddedByTheCourt ? 0 : updatedReasonSequence
      })
    }

    if (updatedCourtCaseReferenceNumber) {
      amendments.offenceCourtCaseReferenceNumber = amendments.offenceCourtCaseReferenceNumber || []
      amendments.offenceCourtCaseReferenceNumber.push({
        offenceIndex,
        value: updatedCourtCaseReferenceNumber ?? ""
      })
    }

    offence.Result.forEach((result, resultIndex) => {
      const updatedOffenceResult = updatedOffenceResults?.[resultIndex]
      const nextResultSourceOrganisation = result.NextResultSourceOrganisation?.OrganisationUnitCode
      const updatedNextResultSourceOrganisation =
        updatedOffenceResult?.NextResultSourceOrganisation?.OrganisationUnitCode

      if (updatedNextResultSourceOrganisation && nextResultSourceOrganisation !== updatedNextResultSourceOrganisation) {
        amendments.nextSourceOrganisation = amendments.nextSourceOrganisation || []
        amendments.nextSourceOrganisation.push({
          resultIndex,
          offenceIndex,
          value: updatedNextResultSourceOrganisation
        })
      }

      const updatedNextHearingDate = updatedOffenceResult?.NextHearingDate
      const nextHearingDate = result.NextHearingDate
      if (updatedNextHearingDate && updatedNextHearingDate !== nextHearingDate) {
        amendments.nextHearingDate = amendments.nextHearingDate || []
        amendments.nextHearingDate.push({
          resultIndex,
          offenceIndex,
          value: formatFormInputDateString(new Date(updatedNextHearingDate))
        })
      }
    })
  })

  return amendments
}

export default getAmendmentsByComparison
