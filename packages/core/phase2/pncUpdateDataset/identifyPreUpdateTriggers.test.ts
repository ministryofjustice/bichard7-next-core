import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
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

    expect(identifyPreUpdateTriggers(pncUpdateDataset as PncUpdateDataset)).toEqual([])
  })
})
