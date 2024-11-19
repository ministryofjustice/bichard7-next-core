import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"

const generatePncUpdateDatasetFromOffenceList = (offences: Offence[]) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          ForceOwner: {
            BottomLevelCode: "",
            OrganisationUnitCode: "",
            SecondLevelCode: "second-level-code",
            ThirdLevelCode: "",
            TopLevelCode: ""
          },
          HearingDefendant: {
            BailConditions: [],
            Offence: offences
          }
        },
        Hearing: {
          CourtHearingLocation: {
            BottomLevelCode: "",
            OrganisationUnitCode: "",
            SecondLevelCode: "",
            ThirdLevelCode: "",
            TopLevelCode: ""
          }
        }
      }
    },
    Exceptions: [],
    PncOperations: []
  }) as unknown as PncUpdateDataset

export default generatePncUpdateDatasetFromOffenceList
