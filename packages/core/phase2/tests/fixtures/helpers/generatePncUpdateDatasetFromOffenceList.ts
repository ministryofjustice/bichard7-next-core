import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"

const generatePncUpdateDatasetFromOffenceList = (offences: Offence[]) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: offences
          }
        }
      }
    },
    Exceptions: [],
    PncOperations: []
  }) as unknown as PncUpdateDataset

export default generatePncUpdateDatasetFromOffenceList
