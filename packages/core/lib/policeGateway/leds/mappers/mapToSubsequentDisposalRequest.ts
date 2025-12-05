import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type DisposalUpdatedPncUpdateRequest from "../../../../phase3/types/DisposalUpdatedPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "../../../../phase3/types/SentenceDeferredPncUpdateRequest"
import type {
  ReasonForAppearance,
  SubsequentDisposalResultsRequest
} from "../../../../types/leds/SubsequentDisposalResultsRequest"

import { convertDate } from "../dateTimeConverter"
import mapOffences from "./mapToAddDisposalRequest/mapOffences"

const reasonForAppearance: Record<string, ReasonForAppearance> = {
  V: "Subsequently Varied",
  D: "Sentenced Deferred"
}

const mapToSubsequentDisposalRequest = (
  pncRequest: DisposalUpdatedPncUpdateRequest["request"] | SentenceDeferredPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): SubsequentDisposalResultsRequest => {
  return {
    ownerCode: pncRequest.forceStationCode,
    personUrn: pncRequest.pncIdentifier ?? "",
    checkName: pncRequest.pncCheckName ?? "",
    courtCaseReference: pncRequest.courtCaseReferenceNumber,
    court: {
      courtIdentityType: "code",
      courtCode: pncRequest.courtCode
    },
    appearanceDate: convertDate(pncRequest.hearingDate),
    reasonForAppearance: reasonForAppearance[pncRequest.hearingType],
    offences: mapOffences(pncRequest.hearingDetails, pncUpdateDataset, pncRequest.courtCaseReferenceNumber)
  }
}

export default mapToSubsequentDisposalRequest
