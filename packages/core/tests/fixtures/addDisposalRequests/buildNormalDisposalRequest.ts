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
    arrestSummonsNumber: "11/01ZD/01/1448754K",
    psaCourtCode,
    courtHouseName: "Court house name",
    dateOfHearing: "12082025",
    generatedPNCFilename: "",
    pendingPsaCourtCode,
    pendingCourtDate: "13082025",
    pendingCourtHouseName: "Pending court house name",
    preTrialIssuesUniqueReferenceNumber: "121212",
    hearingsAdjudicationsAndDisposals: [
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
        hearingDate: "14082025",
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
        offenceStartDate: "16082025",
        offenceStartTime: "1430",
        offenceEndDate: "17082025",
        offenceEndTime: "1445",
        type: PncUpdateType.ARREST
      },
      {
        hearingDate: "15082025",
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
        offenceStartDate: "16082025",
        offenceStartTime: "1430",
        offenceEndDate: "17082025",
        offenceEndTime: "1445",
        type: PncUpdateType.ARREST
      },
      {
        hearingDate: "15082025",
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
