import type {
  PncUpdateAdjudication,
  PncUpdateArrestHearing,
  PncUpdateCourtHearing,
  PncUpdateDisposal
} from "../../../../phase3/types/HearingDetails"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import mergeOffenceDetails from "./mergeOffenceDetails"

describe("mergeOffenceDetails", () => {
  it("should merge offence details when offences are not added by the court (existing offences on Police system)", () => {
    const input = [
      { type: PncUpdateType.ORDINARY, courtOffenceSequenceNumber: "1" } as PncUpdateCourtHearing,
      { type: PncUpdateType.ADJUDICATION, hearingDate: "10112025" } as PncUpdateAdjudication,
      { type: PncUpdateType.DISPOSAL, disposalType: "1015" } as PncUpdateDisposal,
      { type: PncUpdateType.DISPOSAL, disposalType: "2059" } as PncUpdateDisposal,
      { type: PncUpdateType.ORDINARY, courtOffenceSequenceNumber: "2" } as PncUpdateCourtHearing,
      { type: PncUpdateType.ADJUDICATION, hearingDate: "15122025" } as PncUpdateAdjudication,
      { type: PncUpdateType.DISPOSAL, disposalType: "2060" } as PncUpdateDisposal
    ]

    const offences = mergeOffenceDetails(input)

    expect(offences).toEqual([
      {
        adjudication: { hearingDate: "10112025", type: "ADJUDICATION" },
        disposals: [
          { disposalType: "1015", type: "DISPOSAL" },
          { disposalType: "2059", type: "DISPOSAL" }
        ],
        ordinary: { courtOffenceSequenceNumber: "1", type: "ORDINARY" }
      },
      {
        adjudication: { hearingDate: "15122025", type: "ADJUDICATION" },
        disposals: [{ disposalType: "2060", type: "DISPOSAL" }],
        ordinary: { courtOffenceSequenceNumber: "2", type: "ORDINARY" }
      }
    ])
  })

  it("should merge offence details when offences are added by the court (new additional arrest offences on Police system)", () => {
    const input = [
      { type: PncUpdateType.ARREST, courtOffenceSequenceNumber: "3" } as PncUpdateArrestHearing,
      { type: PncUpdateType.ADJUDICATION, hearingDate: "10112026" } as PncUpdateAdjudication,
      { type: PncUpdateType.DISPOSAL, disposalType: "2059" } as PncUpdateDisposal,
      { type: PncUpdateType.DISPOSAL, disposalType: "2060" } as PncUpdateDisposal,
      { type: PncUpdateType.ARREST, courtOffenceSequenceNumber: "4" } as PncUpdateArrestHearing,
      { type: PncUpdateType.ADJUDICATION, hearingDate: "15122026" } as PncUpdateAdjudication,
      { type: PncUpdateType.DISPOSAL, disposalType: "1015" } as PncUpdateDisposal
    ]

    const offences = mergeOffenceDetails(input)

    expect(offences).toEqual([
      {
        adjudication: { hearingDate: "10112026", type: "ADJUDICATION" },
        disposals: [
          { disposalType: "2059", type: "DISPOSAL" },
          { disposalType: "2060", type: "DISPOSAL" }
        ],
        arrest: { courtOffenceSequenceNumber: "3", type: "ARREST" }
      },
      {
        adjudication: { hearingDate: "15122026", type: "ADJUDICATION" },
        disposals: [{ disposalType: "1015", type: "DISPOSAL" }],
        arrest: { courtOffenceSequenceNumber: "4", type: "ARREST" }
      }
    ])
  })
})
