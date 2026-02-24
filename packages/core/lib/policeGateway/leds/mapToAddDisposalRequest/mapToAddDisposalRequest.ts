import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type NormalDisposalPncUpdateRequest from "../../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest, CarryForward } from "../../../../types/leds/AddDisposalRequest"

import convertLongAsnToLedsFormat from "../convertLongAsnToLedsFormat"
import { convertDate } from "../dateTimeConverter"
import mapAdditionalArrestOffences from "./mapAdditionalArrestOffences"
import mapCourt from "./mapCourt"
import mapDefendant from "./mapDefendant"
import mapOffences from "./mapOffences"

const mapToAddDisposalRequest = (
  pncRequest: NormalDisposalPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): AddDisposalRequest => {
  const carryForward: CarryForward | undefined =
    pncRequest.pendingPsaCourtCode && pncRequest.pendingCourtDate
      ? {
          appearanceDate: convertDate(pncRequest.pendingCourtDate),
          court: mapCourt(pncRequest.pendingPsaCourtCode, pncRequest.pendingCourtHouseName)
        }
      : undefined

  const arrestSummonsNumber = convertLongAsnToLedsFormat(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )
  const additionalArrestOffences =
    arrestSummonsNumber && pncRequest.arrestsAdjudicationsAndDisposals.length > 0
      ? mapAdditionalArrestOffences(arrestSummonsNumber, pncRequest.arrestsAdjudicationsAndDisposals)
      : undefined

  return {
    ownerCode: pncRequest.forceStationCode,
    personUrn: pncRequest.pncIdentifier ?? "",
    checkName: pncRequest.pncCheckName ?? "",
    courtCaseReference: pncRequest.courtCaseReferenceNumber,
    court: mapCourt(pncRequest.psaCourtCode, pncRequest.courtHouseName),
    dateOfConviction: convertDate(pncRequest.dateOfHearing),
    defendant: mapDefendant(pncUpdateDataset),
    carryForward,
    ...(pncRequest.preTrialIssuesUniqueReferenceNumber && {
      referToCourtCase: {
        reference: pncRequest.preTrialIssuesUniqueReferenceNumber
      }
    }),
    offences: mapOffences(
      pncRequest.hearingsAdjudicationsAndDisposals,
      pncUpdateDataset,
      pncRequest.courtCaseReferenceNumber
    ),
    additionalArrestOffences
  }
}

export default mapToAddDisposalRequest
