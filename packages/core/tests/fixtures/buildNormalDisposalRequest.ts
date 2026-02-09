import type NormalDisposalPncUpdateRequest from "../../phase3/types/NormalDisposalPncUpdateRequest"

import { PncUpdateType } from "../../phase3/types/HearingDetails"

export const buildNormalDisposalRequest = (
  overrides: Partial<NormalDisposalPncUpdateRequest["request"]> = {}
): NormalDisposalPncUpdateRequest["request"] => {
  const base: NormalDisposalPncUpdateRequest["request"] = {
    forceStationCode: "07A1",
    pncIdentifier: "22/858J",
    pncCheckName: "Pnc check name",
    courtCaseReferenceNumber: "98/2048/633Y",
    arrestSummonsNumber: "11/01ZD/01/1448754K",
    psaCourtCode: "0001",
    courtHouseName: "Court house name",
    dateOfHearing: "12082025",
    generatedPNCFilename: "",
    pendingPsaCourtCode: "0002",
    pendingCourtDate: "13082025",
    pendingCourtHouseName: "Pending court house name",
    preTrialIssuesUniqueReferenceNumber: "121212",
    croNumber: null,
    hearingsAdjudicationsAndDisposals: [
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "00112233",
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
        disposalQualifiers: "A",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        disposalQualifiers: "A",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "00112233",
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
        disposalQualifiers: "A",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        disposalQualifiers: "A",
        disposalQuantity: "D123100520240012000.9900",
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
        offenceReason: "00998877",
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
        disposalQualifiers: "A",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        committedOnBail: "y",
        courtOffenceSequenceNumber: "2",
        locationOfOffence: "Offence location",
        offenceLocationFSCode: "Offence location FS code",
        offenceReason: "00998877",
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
        disposalQualifiers: "A",
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
