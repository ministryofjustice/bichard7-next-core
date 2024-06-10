import type { Trigger } from "../../phase1/types/Trigger"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { TriggerCode } from "../../types/TriggerCode"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import identifyPreUpdateTriggers from "./identifyPreUpdateTriggers"

describe("identifyPreUpdateTriggers", () => {
  it("returns an array of pre-update Triggers", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions = []
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
      CourtHearingLocation: {
        TopLevelCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        BottomLevelCode: "",
        OrganisationUnitCode: ""
      }
    } as Extract<AnnotatedHearingOutcome, "AnnotatedHearingOutcome.HearingOutcome.Hearing">
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      TopLevelCode: "",
      SecondLevelCode: "second-level-code",
      ThirdLevelCode: "",
      BottomLevelCode: "",
      OrganisationUnitCode: ""
    }
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {
        Result: [
          {
            CJSresultCode: 4012,
            SourceOrganisation: {
              TopLevelCode: "",
              SecondLevelCode: "second-level-code",
              ThirdLevelCode: "",
              BottomLevelCode: "",
              OrganisationUnitCode: ""
            },
            ResultQualifierVariable: []
          }
        ],
        CriminalProsecutionReference: {},
        ActualOffenceDateCode: "",
        ActualOffenceStartDate: {
          StartDate: new Date()
        },
        ActualOffenceWording: "",
        CommittedOnBail: "",
        CourtOffenceSequenceNumber: 0
      }
    ]

    pncUpdateDataset

    expect(identifyPreUpdateTriggers(pncUpdateDataset as PncUpdateDataset)).toEqual<Trigger[]>([
      { code: TriggerCode.TRPR0005 }
    ])
  })
})
