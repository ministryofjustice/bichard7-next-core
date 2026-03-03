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

  it.each([2059, 2060])(
    "should not include plea and adjudication when case is carried forward or referred to court case and offence has disposal result %i",
    (disposalResultCode) => {
      const arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[] = [
        {
          committedOnBail: "y",
          courtOffenceSequenceNumber: "3",
          locationOfOffence: "Offence location",
          offenceLocationFSCode: "Offence location FS code",
          offenceReason: "SX03001B",
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
          disposalType: "1015",
          type: PncUpdateType.DISPOSAL
        },
        {
          committedOnBail: "y",
          courtOffenceSequenceNumber: "4",
          locationOfOffence: "Offence location",
          offenceLocationFSCode: "Offence location FS code",
          offenceReason: "TH68006",
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
          disposalType: String(disposalResultCode),
          type: PncUpdateType.DISPOSAL
        }
      ]

      const additionalOffences = mapAdditionalArrestOffences(asn, arrestsAdjudicationsAndDisposals, true)

      const offences = additionalOffences[0].additionalOffences

      const firstOffenceCode =
        offences[0].offenceCode.offenceCodeType === "cjs" && offences[0].offenceCode.cjsOffenceCode
      expect(firstOffenceCode).toBe("SX03001")
      expect(offences[0].plea).toBe("Resisted")
      expect(offences[0].adjudication).toBe("Not Guilty")

      const secondOffenceCode =
        offences[1].offenceCode.offenceCodeType === "cjs" && offences[1].offenceCode.cjsOffenceCode
      expect(secondOffenceCode).toBe("TH68006")
      expect(offences[1].plea).toBeUndefined()
      expect(offences[1].adjudication).toBeUndefined()
    }
  )
})
