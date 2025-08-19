import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import { generateArrestHearingsAdjudicationsAndDisposals } from "./generateArrestHearingsAdjudicationsAndDisposals"

describe("generateArrestHearingsAdjudicationsAndDisposals", () => {
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
    ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
    PNCDisposalType: 2060,
    NumberOfOffencesTIC: 1
  }
  const recordableOffence = {
    AddedByTheCourt: true,
    ActualOffenceStartDate: { StartDate: new Date("2024-12-10") },
    ActualOffenceEndDate: { EndDate: new Date("2024-12-16") },
    CommittedOnBail: "Y",
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "LocalOffenceReason",
        LocalOffenceCode: { OffenceCode: "11412HSD", AreaCode: "56" }
      },
      OffenceReasonSequence: "1"
    },
    LocationOfOffence: "Some High Street",
    OffenceTime: "09:00",
    OffenceEndTime: "15:00",
    Result: [result, result]
  } as Offence
  const recordableOffenceNotAddedByTheCourt = { ...recordableOffence, AddedByTheCourt: false }

  it("returns an empty list when only recordable offences not added by the court", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: { Case: { HearingDefendant: { Offence: [recordableOffenceNotAddedByTheCourt] } } }
      }
    } as PncUpdateDataset

    const arrestHearingsAndDisposals = generateArrestHearingsAdjudicationsAndDisposals(
      pncUpdateDataset,
      courtCaseReference
    )

    expect(arrestHearingsAndDisposals).toHaveLength(0)
  })

  it("returns an empty list when only recordable offences incompatible with disposal", () => {
    const incompatibleRecordableOffence = {
      ...recordableOffence,
      Result: [{ ...result, ResultClass: ResultClass.SENTENCE }]
    }
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: { Case: { HearingDefendant: { Offence: [incompatibleRecordableOffence] } } }
      }
    } as PncUpdateDataset

    const arrestHearingsAndDisposals = generateArrestHearingsAdjudicationsAndDisposals(
      pncUpdateDataset,
      courtCaseReference
    )

    expect(arrestHearingsAndDisposals).toHaveLength(0)
  })

  it("returns a hearing, adjudication and disposals for each compatible recordable offence added by the court", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: { HearingDefendant: { Offence: [recordableOffence, recordableOffenceNotAddedByTheCourt] } },
          Hearing: { DateOfHearing: new Date("2024-12-25") }
        }
      }
    } as PncUpdateDataset

    const arrestHearingsAndDisposals = generateArrestHearingsAdjudicationsAndDisposals(
      pncUpdateDataset,
      courtCaseReference
    )

    expect(arrestHearingsAndDisposals).toStrictEqual([
      {
        committedOnBail: "Y",
        courtOffenceSequenceNumber: "001",
        locationOfOffence: "Some High Street",
        offenceEndDate: "16122024",
        offenceEndTime: "1500",
        offenceLocationFSCode: "0000",
        offenceReason: "11412HSD",
        offenceReasonSequence: "001",
        offenceStartDate: "10122024",
        offenceStartTime: "0900",
        type: "ARREST"
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
