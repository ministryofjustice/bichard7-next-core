import type NormalDisposalPncUpdateRequest from "../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest } from "../../../types/leds/AddDisposalRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../phase3/lib/getPncCourtCode"
import { PncUpdateType } from "../../../phase3/types/HearingDetails"
import mapToNormalDisposalRequest from "./mapToNormalDisposalRequest"

describe("mapToNormalDisposalRequest", () => {
  const buildNormalDisposalRequest = (
    psaCourtCode?: string,
    generatedPNCFilename?: string,
    pendingPsaCourtCode?: string
  ): NormalDisposalPncUpdateRequest["request"] => {
    return {
      forceStationCode: "07A1",
      pncIdentifier: "22/858J",
      pncCheckName: "Pnc check name",
      courtCaseReferenceNumber: "98/2048/633Y",
      psaCourtCode,
      courtHouseName: "Court house name",
      dateOfHearing: "2025-08-12",
      generatedPNCFilename,
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
          pleaStatus: "Not Known",
          verdict: "Non-Conviction",
          type: PncUpdateType.ADJUDICATION
        },
        {
          disposalQualifiers: "Disposal qualifiers",
          disposalQuantity: "Disposal quantity",
          disposalText: "Disposal text",
          disposalType: "10",
          type: PncUpdateType.DISPOSAL
        }
      ],
      arrestsAdjudicationsAndDisposals: [
        {
          hearingDate: "2025-08-15",
          numberOffencesTakenIntoAccount: "4",
          pleaStatus: "Not Known",
          verdict: "Non-Conviction",
          type: PncUpdateType.ADJUDICATION
        },
        {
          committedOnBail: "true",
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
          disposalQualifiers: "Disposal qualifiers",
          disposalQuantity: "Disposal quantity",
          disposalText: "Disposal text",
          disposalType: "10",
          type: PncUpdateType.DISPOSAL
        }
      ]
    } as NormalDisposalPncUpdateRequest["request"]
  }

  it("maps the normal disposal request to LEDS normal disposal request", () => {
    const request = buildNormalDisposalRequest(PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR, "individual", "1234")
    const expectedLedsRequest = {
      ownerCode: "07A1",
      personUrn: "22/858J",
      checkName: "Pnc check name",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "name",
        courtName: "Court house name"
      },
      dateOfConviction: "2025-08-12",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: [""],
        defendantLastName: ""
      },
      carryForward: {
        appearanceDate: "2025-08-13",
        court: {
          courtIdentityType: "code",
          courtCode: "1234"
        }
      },
      referToCourtCase: {
        reference: "121212"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "Offence reason",
          plea: "Not Known",
          adjudication: "Non-Conviction",
          dateOfSentence: "2025-08-14",
          offenceTic: 3,
          disposalResults: [
            {
              disposalCode: 10,
              disposalQualifies: ["Disposal qualifiers"],
              disposalText: "Disposal text"
            }
          ],
          offenceId: ""
        }
      ],
      additionalArrestOffences: [
        {
          asn: "",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "Offence reason",
              committedOnBail: true,
              plea: "Not Known",
              adjudication: "Non-Conviction",
              dateOfSentence: "2025-08-15",
              offenceTic: 4,
              offenceStartDate: "2025-08-16",
              offenceStartTime: "14:30+02:00",
              offenceEndDate: "2025-08-17",
              offenceEndTime: "14:30+02:00",
              disposalResults: [
                {
                  disposalCode: 10,
                  disposalQualifies: ["Disposal qualifiers"],
                  disposalText: "Disposal text"
                }
              ],
              locationFsCode: "Offence location FS code",
              locationText: "Offence location"
            }
          ]
        }
      ]
    } as AddDisposalRequest

    const ledsRequest = mapToNormalDisposalRequest(request)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })

  it("produces a different LEDS request when psaCourtCode, generatedPNCFilename and pendingPsaCourtCode values differ", () => {
    const request = buildNormalDisposalRequest("1112", "organisation")
    const expectedLedsRequest = {
      ownerCode: "07A1",
      personUrn: "22/858J",
      checkName: "Pnc check name",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "1112"
      },
      dateOfConviction: "2025-08-12",
      defendant: {
        defendantType: "organisation",
        defendantOrganisationName: ""
      },
      carryForward: undefined,
      referToCourtCase: {
        reference: "121212"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "Offence reason",
          plea: "Not Known",
          adjudication: "Non-Conviction",
          dateOfSentence: "2025-08-14",
          offenceTic: 3,
          disposalResults: [
            {
              disposalCode: 10,
              disposalQualifies: ["Disposal qualifiers"],
              disposalText: "Disposal text"
            }
          ],
          offenceId: ""
        }
      ],
      additionalArrestOffences: [
        {
          asn: "",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "Offence reason",
              committedOnBail: true,
              plea: "Not Known",
              adjudication: "Non-Conviction",
              dateOfSentence: "2025-08-15",
              offenceTic: 4,
              offenceStartDate: "2025-08-16",
              offenceStartTime: "14:30+02:00",
              offenceEndDate: "2025-08-17",
              offenceEndTime: "14:30+02:00",
              disposalResults: [
                {
                  disposalCode: 10,
                  disposalQualifies: ["Disposal qualifiers"],
                  disposalText: "Disposal text"
                }
              ],
              locationFsCode: "Offence location FS code",
              locationText: "Offence location"
            }
          ]
        }
      ]
    } as AddDisposalRequest

    const ledsRequest = mapToNormalDisposalRequest(request)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })
})
