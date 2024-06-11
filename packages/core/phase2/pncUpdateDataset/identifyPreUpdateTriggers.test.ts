import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { TriggerCode } from "../../types/TriggerCode"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import identifyPreUpdateTriggers from "./identifyPreUpdateTriggers"

describe("identifyPreUpdateTriggers", () => {
  it("returns an array of pre-update Triggers", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
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
    ])

    expect(identifyPreUpdateTriggers(pncUpdateDataset as PncUpdateDataset)).toEqual<Trigger[]>([
      { code: TriggerCode.TRPR0005 }
    ])
  })
})
