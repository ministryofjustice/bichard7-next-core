import type DisposalUpdatedPncUpdateRequest from "../../../phase3/types/DisposalUpdatedPncUpdateRequest"

import { PncUpdateType } from "../../../phase3/types/HearingDetails"

type UpdatedRequest = DisposalUpdatedPncUpdateRequest["request"]

export const buildUpdatedRequest = (overrides: Partial<UpdatedRequest> = {}): UpdatedRequest => {
  const base: UpdatedRequest = {
    croNumber: "111",
    forceStationCode: "07A1",
    courtCaseReferenceNumber: "98/2048/633Y",
    courtCode: "Court code",
    hearingDate: "12082025",
    hearingType: "D",
    pncCheckName: "Pnc check name",
    pncIdentifier: "22/858J",
    hearingDetails: [
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "Offence reason",
        type: PncUpdateType.ORDINARY
      },
      {
        hearingDate: "14082025",
        numberOffencesTakenIntoAccount: "3",
        pleaStatus: "NO PLEA TAKEN",
        verdict: "NON-CONVICTION",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      }
    ]
  }

  return {
    ...base,
    ...overrides
  }
}
