import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../../phase3/lib/getPncCourtCode"
import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import { buildLedsNormalDisposalRequest } from "../../../../tests/fixtures/buildLedsNormalDisposalRequest"
import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import mapToAddDisposalRequest from "./mapToAddDisposalRequest"

describe("mapToNormalDisposalRequest", () => {
  it("maps the normal disposal request to LEDS normal disposal request", () => {
    const request = buildNormalDisposalRequest({
      psaCourtCode: PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR,
      pendingPsaCourtCode: "0001"
    })
    const pncUpdateDataset = buildPncUpdateDataset({ familyName: "Brown", givenName: ["Adam"] })
    const expectedLedsRequest = buildLedsNormalDisposalRequest()

    const ledsRequest = mapToAddDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })

  it("produces a different LEDS request when psaCourtCode, defendantOrganisation and pendingPsaCourtCode values differ", () => {
    const request = buildNormalDisposalRequest({ psaCourtCode: "1112", pendingPsaCourtCode: undefined })
    const pncUpdateDataset = buildPncUpdateDataset({ organisationName: "Org" })
    const expectedLedsRequest = buildLedsNormalDisposalRequest({
      court: { courtIdentityType: "code", courtCode: "1112" },
      defendant: { defendantType: "organisation", defendantOrganisationName: "Org" },
      carryForward: undefined
    })

    const ledsRequest = mapToAddDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })

  it("maps disposalDuration, disposalFine and disposalEffectiveDate from disposalQuantity", () => {
    const base = buildNormalDisposalRequest()
    const request = buildNormalDisposalRequest({
      psaCourtCode: PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR,
      pendingPsaCourtCode: "0001",
      hearingsAdjudicationsAndDisposals: [
        ...base.hearingsAdjudicationsAndDisposals.slice(0, 2),
        {
          disposalQualifiers: "A",
          disposalQuantity: "d1  101220240000009.9900",
          disposalText: "Disposal text",
          disposalType: "10",
          type: PncUpdateType.DISPOSAL
        },
        ...base.hearingsAdjudicationsAndDisposals.slice(3)
      ]
    })
    const pncUpdateDataset = buildPncUpdateDataset({ familyName: "Brown", givenName: ["Adam"] })
    const expectedLedsRequest = buildLedsNormalDisposalRequest({
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "SX03001",
          roleQualifiers: ["AT"],
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2025-08-14",
          offenceTic: 3,
          disposalResults: [
            {
              disposalCode: 10,
              disposalDuration: {
                units: "days",
                count: 1
              },
              disposalFine: {
                amount: 9.99
              },
              disposalEffectiveDate: "2024-12-10",
              disposalQualifiers: ["A"],
              disposalText: "Disposal text"
            },
            {
              disposalCode: 10,
              disposalDuration: {
                units: "days",
                count: 123
              },
              disposalFine: {
                amount: 12000.99
              },
              disposalEffectiveDate: "2024-05-10",
              disposalQualifiers: ["A"],
              disposalText: "Disposal text"
            }
          ],
          offenceId: "66cdba73-c8a7-426d-a766-02e449843a69"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "CJ03507",
          roleQualifiers: undefined,
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2025-08-14",
          offenceTic: 3,
          disposalResults: [
            {
              disposalCode: 10,
              disposalDuration: {
                units: "days",
                count: 123
              },
              disposalFine: {
                amount: 12000.99
              },
              disposalEffectiveDate: "2024-05-10",
              disposalQualifiers: ["A"],
              disposalText: "Disposal text"
            },
            {
              disposalCode: 10,
              disposalDuration: {
                units: "days",
                count: 123
              },
              disposalFine: {
                amount: 12000.99
              },
              disposalEffectiveDate: "2024-05-10",
              disposalQualifiers: ["A"],
              disposalText: "Disposal text"
            }
          ],
          offenceId: "025459be-b60b-4919-8b7c-67371f2ca80b"
        }
      ]
    })

    const ledsRequest = mapToAddDisposalRequest(request, pncUpdateDataset)

    expect(ledsRequest).toEqual(expectedLedsRequest)
  })
})
