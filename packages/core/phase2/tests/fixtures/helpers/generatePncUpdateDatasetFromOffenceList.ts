import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"

const generatePncUpdateDatasetFromOffenceList = (offences: Offence[]) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: {
          CourtHearingLocation: {
            TopLevelCode: "",
            SecondLevelCode: "",
            ThirdLevelCode: "",
            BottomLevelCode: "",
            OrganisationUnitCode: ""
          }
        },
        Case: {
          HearingDefendant: {
            Offence: offences,
            BailConditions: []
          },
          ForceOwner: {
            TopLevelCode: "",
            SecondLevelCode: "second-level-code",
            ThirdLevelCode: "",
            BottomLevelCode: "",
            OrganisationUnitCode: ""
          }
        }
      }
    },
    Exceptions: [],
    PncOperations: []
  }) as unknown as PncUpdateDataset

export default generatePncUpdateDatasetFromOffenceList
