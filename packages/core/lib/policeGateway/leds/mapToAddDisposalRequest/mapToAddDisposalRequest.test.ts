import type { AddDisposalRequest } from "../../../../types/leds/AddDisposalRequest"
import type {
  Court,
  DateString,
  Defendant,
  DisposalDuration,
  DisposalFine
} from "../../../../types/leds/DisposalRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../../phase3/lib/getPncCourtCode"
import { buildNormalDisposalRequest } from "../../../../tests/fixtures/addDisposalRequests/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/addDisposalRequests/buildPncUpdateDataset"
import mapToAddDisposalRequest from "./mapToAddDisposalRequest"

describe("mapToNormalDisposalRequest", () => {
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
        plea: "No Plea Taken",
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
          },
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
      },
      {
        courtOffenceSequenceNumber: 1,
        cjsOffenceCode: "Offence reason",
        plea: "No Plea Taken",
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
          },
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
            plea: "Resisted",
            adjudication: "Not Guilty",
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
          },
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "Offence reason",
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
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

    const ledsRequest = mapToAddDisposalRequest(request, pncUpdateDataset)

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

    const ledsRequest = mapToAddDisposalRequest(request, pncUpdateDataset)

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

    const ledsRequest = mapToAddDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })
})
