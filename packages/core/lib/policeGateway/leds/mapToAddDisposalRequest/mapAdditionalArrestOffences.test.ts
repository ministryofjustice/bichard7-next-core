import type { PncUpdateArrestHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import mapAdditionalArrestOffences from "./mapAdditionalArrestOffences"

describe("mapAdditionalArrestOffences", () => {
  const asn = "1101ZD01410836V"

  it("maps additional arrest offences", () => {
    const normalDisposalRequest = buildNormalDisposalRequest()
    const expectedAdditionalOffences = [
      {
        asn: "11/01ZD/01/00000410836V",
        additionalOffences: [
          {
            courtOffenceSequenceNumber: 3,
            offenceCode: {
              cjsOffenceCode: "SX03001",
              offenceCodeType: "cjs"
            },
            roleQualifiers: ["AA"],
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
            dateOfSentence: "2025-08-15",
            offenceTic: 4,
            offenceStartDate: "2025-08-16",
            offenceStartTime: "14:30+00:00",
            offenceEndDate: "2025-08-17",
            offenceEndTime: "14:45+00:00",
            disposalResults: [
              {
                disposalCode: 10,
                disposalDuration: {
                  count: 123,
                  units: "days"
                },
                disposalEffectiveDate: "2024-05-10",
                disposalFine: {
                  amount: 12000.99
                },
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: { locationText: "Offence location" }
          },
          {
            courtOffenceSequenceNumber: 4,
            offenceCode: {
              cjsOffenceCode: "TH68006",
              offenceCodeType: "cjs"
            },
            roleQualifiers: undefined,
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
            dateOfSentence: "2025-08-15",
            offenceTic: 4,
            offenceStartDate: "2025-08-16",
            offenceStartTime: "14:30+00:00",
            offenceEndDate: "2025-08-17",
            offenceEndTime: "14:45+00:00",
            disposalResults: [
              {
                disposalCode: 10,
                disposalDuration: {
                  count: 123,
                  units: "days"
                },
                disposalEffectiveDate: "2024-05-10",
                disposalFine: {
                  amount: 12000.99
                },
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: { locationText: "Offence location" }
          }
        ]
      }
    ]

    const additionalOffences = mapAdditionalArrestOffences(
      asn,
      normalDisposalRequest.arrestsAdjudicationsAndDisposals,
      false
    )

    expect(additionalOffences).toStrictEqual(expectedAdditionalOffences)
  })

  it("handles missing adjudication and disposal", () => {
    const arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[] = [
      {
        committedOnBail: "y",
        courtOffenceSequenceNumber: "3",
        offenceReason: "Some offence",
        type: PncUpdateType.ARREST,
        offenceStartDate: "02052025",
        offenceStartTime: "1645",
        offenceEndDate: "03052025",
        offenceEndTime: "1700",
        locationOfOffence: "Dummy location",
        offenceLocationFSCode: "Dummy location fs code",
        offenceReasonSequence: "Dummy reason sequence"
      }
    ]

    const result = mapAdditionalArrestOffences(asn, arrestsAdjudicationsAndDisposals, false)

    expect(result[0].additionalOffences[0]).toMatchObject({
      plea: undefined,
      adjudication: undefined,
      disposalResults: [],
      committedOnBail: true
    })
  })

  it("handles missing disposalQualifiers and disposalText", () => {
    const arrestsAdjudicationsAndDisposals = [
      {
        committedOnBail: "y",
        courtOffenceSequenceNumber: "1",
        type: PncUpdateType.ARREST,
        offenceReason: "Some offence",
        offenceStartDate: "02052025",
        offenceStartTime: "1645",
        offenceEndDate: "03052025",
        offenceEndTime: "1700",
        locationOfOffence: "Dummy location",
        offenceLocationFSCode: "Dummy location fs code",
        offenceReasonSequence: "Dummy reason sequence"
      },
      { type: PncUpdateType.ADJUDICATION },
      { disposalType: "20", type: PncUpdateType.DISPOSAL }
    ] as PncUpdateArrestHearingAdjudicationAndDisposal[]

    const result = mapAdditionalArrestOffences(asn, arrestsAdjudicationsAndDisposals, false)
    expect(result?.[0].additionalOffences?.[0].disposalResults?.[0]).toEqual({
      disposalCode: 20,
      disposalDuration: undefined,
      disposalEffectiveDate: undefined,
      disposalQualifiers: undefined,
      disposalText: undefined
    })
  })
})
