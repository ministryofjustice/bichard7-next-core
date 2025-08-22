import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const generateAhoFromOffenceList = (offences: Offence[]) =>
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
    Exceptions: []
  }) as unknown as AnnotatedHearingOutcome

export default generateAhoFromOffenceList
