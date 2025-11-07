import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type NormalDisposalPncUpdateRequest from "../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest } from "../../../types/leds/AddDisposalRequest"
import type { Court, DateString, Defendant, DisposalDuration, DisposalFine } from "../../../types/leds/DisposalRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../phase3/lib/getPncCourtCode"
import { PncUpdateType } from "../../../phase3/types/HearingDetails"
import mapToNormalDisposalRequest from "./mapToNormalDisposalRequest"

describe("mapToNormalDisposalRequest", () => {
  const buildNormalDisposalRequest = (
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
          pleaStatus: "Not Known",
          verdict: "Non-Conviction",
          type: PncUpdateType.ADJUDICATION
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

  const buildPncUpdateDataset = (familyName?: string, givenName?: string[], organisationName?: string) => {
    return {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              DefendantDetail: {
                PersonName: {
                  FamilyName: familyName,
                  GivenName: givenName
                }
              },
              OrganisationName: organisationName
            }
          }
        }
      },
      PncQuery: {
        courtCases: [
          {
            courtCaseReference: "98/2048/633Y",
            offences: [
              {
                offence: {
                  sequenceNumber: 1,
                  offenceId: "112233"
                }
              }
            ]
          }
        ]
      }
    } as PncUpdateDataset
  }

  const buildExpectedLedsRequest = ({
    court,
    defendant,
    carryForward,
    disposalDuration = { units: "days", count: 123 },
    disposalFine = { amount: 12000.99 },
    disposalEffectiveDate = "2024-05-10"
  }: {
    carryForward?: Record<string, unknown>
    court: Court
    defendant: Defendant
    disposalDuration?: DisposalDuration
    disposalEffectiveDate?: DateString
    disposalFine?: DisposalFine
  }): AddDisposalRequest => ({
    ownerCode: "07A1",
    personUrn: "22/858J",
    checkName: "Pnc check name",
    courtCaseReference: "98/2048/633Y",
    court,
    dateOfConviction: "2025-08-12",
    defendant,
    carryForward,
    referToCourtCase: { reference: "121212" },
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
            disposalDuration,
            disposalFine,
            disposalEffectiveDate,
            disposalQualifies: ["Disposal qualifiers"],
            disposalText: "Disposal text"
          }
        ],
        offenceId: "112233"
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
  })

  it("maps the normal disposal request to LEDS normal disposal request", () => {
    const request = buildNormalDisposalRequest(PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR, "1234")
    const pncUpdateDataset = buildPncUpdateDataset("Brown", ["Adam"])
    const expectedLedsRequest = buildExpectedLedsRequest({
      court: { courtIdentityType: "name", courtName: "Court house name" },
      defendant: { defendantType: "individual", defendantFirstNames: ["Adam"], defendantLastName: "Brown" },
      carryForward: {
        appearanceDate: "2025-08-13",
        court: { courtIdentityType: "code", courtCode: "1234" }
      }
    })

    const ledsRequest = mapToNormalDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })

  it("produces a different LEDS request when psaCourtCode, defendantOrganisation and pendingPsaCourtCode values differ", () => {
    const request = buildNormalDisposalRequest("1112")
    const pncUpdateDataset = buildPncUpdateDataset(undefined, undefined, "Org")
    const expectedLedsRequest = buildExpectedLedsRequest({
      court: { courtIdentityType: "code", courtCode: "1112" },
      defendant: { defendantType: "organisation", defendantOrganisationName: "Org" },
      carryForward: undefined
    })

    const ledsRequest = mapToNormalDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })

  it("maps disposalDuration, disposalFine and disposalEffectiveDate from disposalQuantity", () => {
    const request = buildNormalDisposalRequest(
      PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR,
      "1234",
      "d1  101220240000009.9900"
    )
    const pncUpdateDataset = buildPncUpdateDataset("Brown", ["Adam"])
    const expectedLedsRequest = buildExpectedLedsRequest({
      court: { courtIdentityType: "name", courtName: "Court house name" },
      defendant: { defendantType: "individual", defendantFirstNames: ["Adam"], defendantLastName: "Brown" },
      carryForward: {
        appearanceDate: "2025-08-13",
        court: { courtIdentityType: "code", courtCode: "1234" }
      },
      disposalDuration: {
        units: "days",
        count: 1
      },
      disposalFine: {
        amount: 9.99
      },
      disposalEffectiveDate: "2024-12-10"
    })

    const ledsRequest = mapToNormalDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })
})
