import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"

import { generateHearingsAdjudicationsAndDisposals } from "./generateHearingsAdjudicationsAndDisposals"

describe("generateHearingsAdjudicationsAndDisposals", () => {
  const courtCaseReference = "123"
  const result = {
    CJSresultCode: 1100,
    DateSpecifiedInResult: [{ Date: new Date("2024-12-17"), Sequence: 1 }],
    ResultQualifierVariable: [{ Code: "C" }],
    ResultVariableText: "THE DEFENDANT IS NOT TO ENTER PLACE",
    AmountSpecifiedInResult: [{ Amount: 120000.99 }],
    Duration: [
      { DurationUnit: "D", DurationLength: 123 },
      { DurationUnit: "A", DurationLength: 999 }
    ],
    PNCDisposalType: 2060,
    NumberOfOffencesTIC: 1
  }
  const recordableOffence = {
    AddedByTheCourt: false,
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "LocalOffenceReason",
        LocalOffenceCode: { OffenceCode: "11412HSD", AreaCode: "56" }
      },
      OffenceReasonSequence: "1"
    },
    CourtCaseReferenceNumber: courtCaseReference,
    Result: [result, result]
  } as Offence
  const recordableOffenceAddedByTheCourt = { ...recordableOffence, AddedByTheCourt: true }

  it("returns an empty list when only recordable offences added by the court", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: { Case: { HearingDefendant: { Offence: [recordableOffenceAddedByTheCourt] } } }
      }
    } as PncUpdateDataset

    const hearingsAndDisposals = generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, courtCaseReference)

    expect(hearingsAndDisposals).toHaveLength(0)
  })

  it("returns a hearing, adjudication and disposals for each recordable offence not added by the court", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: { HearingDefendant: { Offence: [recordableOffence, recordableOffenceAddedByTheCourt] } },
          Hearing: { DateOfHearing: new Date("2024-12-25") }
        }
      }
    } as PncUpdateDataset

    const hearingsAndDisposals = generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, courtCaseReference)

    expect(hearingsAndDisposals).toStrictEqual([
      {
        courtOffenceSequenceNumber: "001",
        offenceReason: "11412HSD",
        type: "ORDINARY"
      },
      {
        hearingDate: "25122024",
        numberOffencesTakenIntoAccount: "0002",
        pleaStatus: "",
        type: "ADJUDICATION",
        verdict: "NON-CONVICTION"
      },
      {
        disposalQualifiers: "C ",
        disposalQuantity: "D123171220240120000.9900",
        disposalText: "EXCLUDED FROM PLACE",
        disposalType: "2063",
        type: "DISPOSAL"
      },
      {
        disposalQualifiers: "C ",
        disposalQuantity: "D123171220240120000.9900",
        disposalText: "EXCLUDED FROM PLACE",
        disposalType: "2063",
        type: "DISPOSAL"
      }
    ])
  })
})
