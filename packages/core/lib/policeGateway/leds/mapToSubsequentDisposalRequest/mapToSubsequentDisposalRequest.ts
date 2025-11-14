import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type DisposalUpdatedPncUpdateRequest from "../../../../phase3/types/DisposalUpdatedPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "../../../../phase3/types/SentenceDeferredPncUpdateRequest"
import type {
  reasonForAppearance,
  SubsequentDisposalResultsRequest
} from "../../../../types/leds/SubsequentDisposalResultsRequest"

import mapCourt from "../mapToAddDisposalRequest/mapCourt"
import mapOffences from "../mapToAddDisposalRequest/mapOffences"

const mapToSubsequentDisposalRequest = (
  pncRequest: DisposalUpdatedPncUpdateRequest["request"] | SentenceDeferredPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): SubsequentDisposalResultsRequest => {
  return {
    ownerCode: pncRequest.forceStationCode,
    personUrn: pncRequest.pncIdentifier ?? "",
    checkName: pncRequest.pncCheckName ?? "",
    courtCaseReference: pncRequest.courtCaseReferenceNumber,
    court: mapCourt(pncRequest.courtCode, null),
    appearanceDate: pncRequest.hearingDate,
    reasonForAppearance: pncRequest.hearingType as reasonForAppearance,
    offences: mapOffences(pncRequest.hearingDetails, pncUpdateDataset, pncRequest.courtCaseReferenceNumber)
  }
}

export default mapToSubsequentDisposalRequest
