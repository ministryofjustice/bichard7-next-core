import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type NormalDisposalPncUpdateRequest from "../../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest } from "../../../../types/leds/AddDisposalRequest"

import mapAdditionalArrestOffences from "./mapAdditionalArrestOffences"
import mapCourt from "./mapCourt"
import mapDefendant from "./mapDefendant"
import mapOffences from "./mapOffences"

const mapToNormalDisposalRequest = (
  pncRequest: NormalDisposalPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): AddDisposalRequest => {
  const carryForward = pncRequest.pendingPsaCourtCode
    ? {
        appearanceDate: pncRequest.pendingCourtDate ?? undefined,
        court: mapCourt(pncRequest.pendingPsaCourtCode, pncRequest.pendingCourtHouseName)
      }
    : undefined

  return {
    ownerCode: pncRequest.forceStationCode,
    personUrn: pncRequest.pncIdentifier ?? "",
    checkName: pncRequest.pncCheckName ?? "",
    courtCaseReference: pncRequest.courtCaseReferenceNumber,
    court: mapCourt(pncRequest.psaCourtCode, pncRequest.courtHouseName),
    dateOfConviction: pncRequest.dateOfHearing,
    defendant: mapDefendant(pncUpdateDataset),
    carryForward,
    referToCourtCase: {
      reference: pncRequest.preTrialIssuesUniqueReferenceNumber ?? ""
    },
    offences: mapOffences(
      pncRequest.hearingsAdjudicationsAndDisposals,
      pncUpdateDataset,
      pncRequest.courtCaseReferenceNumber
    ),
    additionalArrestOffences: mapAdditionalArrestOffences(
      pncRequest.arrestSummonsNumber,
      pncRequest.arrestsAdjudicationsAndDisposals
    )
  }
}

export default mapToNormalDisposalRequest
