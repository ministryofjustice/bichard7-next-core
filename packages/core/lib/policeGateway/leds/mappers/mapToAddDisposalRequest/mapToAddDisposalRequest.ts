import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type NormalDisposalPncUpdateRequest from "../../../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest } from "../../../../../types/leds/AddDisposalRequest"

import convertPncDateTimeToLedsDateTime from "./convertPncDateTimeToLedsDateTime"
import mapAdditionalArrestOffences from "./mapAdditionalArrestOffences"
import mapCourt from "./mapCourt"
import mapDefendant from "./mapDefendant"
import mapOffences from "./mapOffences"

const mapToAddDisposalRequest = (
  pncRequest: NormalDisposalPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): AddDisposalRequest => {
  const carryForward = pncRequest.pendingPsaCourtCode
    ? {
        appearanceDate: pncRequest.pendingCourtDate
          ? convertPncDateTimeToLedsDateTime(pncRequest.pendingCourtDate).date
          : undefined,
        court: mapCourt(pncRequest.pendingPsaCourtCode, pncRequest.pendingCourtHouseName)
      }
    : undefined

  const additionalArrestOffences =
    pncRequest.arrestSummonsNumber && pncRequest.arrestsAdjudicationsAndDisposals.length > 0
      ? mapAdditionalArrestOffences(pncRequest.arrestSummonsNumber, pncRequest.arrestsAdjudicationsAndDisposals)
      : undefined

  return {
    ownerCode: pncRequest.forceStationCode,
    personUrn: pncRequest.pncIdentifier ?? "",
    checkName: pncRequest.pncCheckName ?? "",
    courtCaseReference: pncRequest.courtCaseReferenceNumber,
    court: mapCourt(pncRequest.psaCourtCode, pncRequest.courtHouseName),
    dateOfConviction: convertPncDateTimeToLedsDateTime(pncRequest.dateOfHearing).date,
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
