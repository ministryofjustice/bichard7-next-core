import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import { forceReceivesTrigger27 } from "./TRPR0027"

const generateMockAho = (forceCode: string, courtCode: string) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          ForceOwner: { SecondLevelCode: forceCode }
        },
        Hearing: { CourtHearingLocation: courtCode }
      }
    }
  }) as unknown as AnnotatedHearingOutcome

describe("TRPR0027", () => {
  it("Should generate a trigger when", () => {})
})
