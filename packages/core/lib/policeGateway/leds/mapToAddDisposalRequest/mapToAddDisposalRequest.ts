import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type NormalDisposalPncUpdateRequest from "../../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest, CarryForward } from "../../../../types/leds/AddDisposalRequest"

import convertAsnToLedsFormat from "../convertAsnToLedsFormat"
import { convertDate } from "../dateTimeConverter"
import preProcessPersonUrn from "../preProcessPersonUrn"
import mapAdditionalArrestOffences from "./mapAdditionalArrestOffences"
import mapCourt from "./mapCourt"
import mapDefendant from "./mapDefendant"
import mapOffences from "./mapOffences"

const mapToAddDisposalRequest = (
  pncRequest: NormalDisposalPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): AddDisposalRequest => {
  const personUrn =
    preProcessPersonUrn(pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier) ??
    ""
  const carryForward: CarryForward | undefined =
    pncRequest.pendingPsaCourtCode && pncRequest.pendingCourtDate
      ? {
          appearanceDate: convertDate(pncRequest.pendingCourtDate),
          court: mapCourt(pncRequest.pendingPsaCourtCode, pncRequest.pendingCourtHouseName)
        }
      : undefined

  const referToCourtCase = pncRequest.preTrialIssuesUniqueReferenceNumber
    ? {
        reference: pncRequest.preTrialIssuesUniqueReferenceNumber
      }
    : undefined

  const isCarriedForwardOrReferredToCourtCase = !!carryForward || !!referToCourtCase

  const arrestSummonsNumber = convertAsnToLedsFormat(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )
  const additionalArrestOffences =
    pncRequest.arrestsAdjudicationsAndDisposals.length > 0
      ? mapAdditionalArrestOffences(
          arrestSummonsNumber,
          pncRequest.arrestsAdjudicationsAndDisposals,
          isCarriedForwardOrReferredToCourtCase
        )
      : undefined

  return {
    ownerCode: pncRequest.forceStationCode,
    personUrn,
    courtCaseReference: pncRequest.courtCaseReferenceNumber,
    court: mapCourt(pncRequest.psaCourtCode, pncRequest.courtHouseName),
    dateOfConviction: convertDate(pncRequest.dateOfHearing),
    defendant: mapDefendant(pncUpdateDataset),
    carryForward,
    referToCourtCase,
    offences: mapOffences(
      pncRequest.hearingsAdjudicationsAndDisposals,
      pncUpdateDataset,
      pncRequest.courtCaseReferenceNumber,
      isCarriedForwardOrReferredToCourtCase
    ),
    additionalArrestOffences
  }
}

export default mapToAddDisposalRequest
