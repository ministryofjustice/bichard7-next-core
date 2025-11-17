import type NormalDisposalPncUpdateRequest from "../../../phase3/types/NormalDisposalPncUpdateRequest"

import { PncUpdateType } from "../../../phase3/types/HearingDetails"

export const buildNormalDisposalRequest = (
  psaCourtCode?: string,
  pendingPsaCourtCode?: string,
  disposalQuantity = "D123100520240012000.9900"
): NormalDisposalPncUpdateRequest["request"] => {
  return {
    forceStationCode: "07A1",
    pncIdentifier: "22/858J",
    pncCheckName: "Pnc check name",
    courtCaseReferenceNumber: "98/2048/633Y",
    psaCourtCode,
    courtHouseName: "Court house name",
    dateOfHearing: "2025-08-12",
    generatedPNCFilename: "",
    pendingPsaCourtCode,
    pendingCourtDate: "2025-08-13",
    pendingCourtHouseName: "Pending court house name",
    preTrialIssuesUniqueReferenceNumber: "121212",
    hearingsAdjudicationsAndDisposals: [
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "Offence reason",
        type: PncUpdateType.ORDINARY
      },
      {
        hearingDate: "2025-08-14",
        numberOffencesTakenIntoAccount: "3",
        pleaStatus: "NO PLEA TAKEN",
        verdict: "NON-CONVICTION",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity,
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity,
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "Offence reason",
        type: PncUpdateType.ORDINARY
      },
      {
        hearingDate: "2025-08-14",
        numberOffencesTakenIntoAccount: "3",
        pleaStatus: "NO PLEA TAKEN",
        verdict: "NON-CONVICTION",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity,
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity,
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      }
    ],
    arrestsAdjudicationsAndDisposals: [
      {
        committedOnBail: "y",
        courtOffenceSequenceNumber: "2",
        locationOfOffence: "Offence location",
        offenceLocationFSCode: "Offence location FS code",
        offenceReason: "Offence reason",
        offenceReasonSequence: "1",
        offenceStartDate: "2025-08-16",
        offenceStartTime: "14:30+02:00",
        offenceEndDate: "2025-08-17",
        offenceEndTime: "14:30+02:00",
        type: PncUpdateType.ARREST
      },
      {
        hearingDate: "2025-08-15",
        numberOffencesTakenIntoAccount: "4",
        pleaStatus: "RESISTED",
        verdict: "NOT GUILTY",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "Disposal quantity",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        committedOnBail: "y",
        courtOffenceSequenceNumber: "2",
        locationOfOffence: "Offence location",
        offenceLocationFSCode: "Offence location FS code",
        offenceReason: "Offence reason",
        offenceReasonSequence: "1",
        offenceStartDate: "2025-08-16",
        offenceStartTime: "14:30+02:00",
        offenceEndDate: "2025-08-17",
        offenceEndTime: "14:30+02:00",
        type: PncUpdateType.ARREST
      },
      {
        hearingDate: "2025-08-15",
        numberOffencesTakenIntoAccount: "4",
        pleaStatus: "RESISTED",
        verdict: "NOT GUILTY",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "Disposal quantity",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      }
    ]
  } as NormalDisposalPncUpdateRequest["request"]
}
