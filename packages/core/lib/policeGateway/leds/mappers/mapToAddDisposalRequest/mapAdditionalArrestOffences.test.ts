import type { PncUpdateArrestHearingAdjudicationAndDisposal } from "../../../../../phase3/types/HearingDetails"

import { PncUpdateType } from "../../../../../phase3/types/HearingDetails"
import { buildNormalDisposalRequest } from "../../../../../tests/fixtures/buildNormalDisposalRequest"
import mapAdditionalArrestOffences from "./mapAdditionalArrestOffences"

describe("mapAdditionalArrestOffences", () => {
  const asn = "1101ZD01410836V"

  it("maps additional arrest offences", () => {
    const normalDisposalRequest = buildNormalDisposalRequest()
    const expectedAdditionalOffences = [
      {
        asn: "1101ZD01410836V",
        additionalOffences: [
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "00998877",
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
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: "Offence location"
          },
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "00998877",
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
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: "Offence location"
          }
        ]
      }
    ]

    const additionalOffences = mapAdditionalArrestOffences(asn, normalDisposalRequest.arrestsAdjudicationsAndDisposals)

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

    const result = mapAdditionalArrestOffences(asn, arrestsAdjudicationsAndDisposals)

    expect(result[0].additionalOffences[0]).toMatchObject({
      plea: "",
      adjudication: "",
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

    const result = mapAdditionalArrestOffences(asn, arrestsAdjudicationsAndDisposals)
    expect(result?.[0].additionalOffences?.[0].disposalResults?.[0]).toEqual({
      disposalCode: 20,
      disposalQualifiers: [""],
      disposalText: undefined
    })
  })
})
