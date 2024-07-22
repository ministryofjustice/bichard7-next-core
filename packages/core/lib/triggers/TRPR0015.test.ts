import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import TRPR0015 from "./TRPR0015"
import Phase from "../../types/Phase"
import generateMockAho from "../../phase1/tests/helpers/generateMockAho"

describe("TRPR0015", () => {
    const triggerOptions = {
  triggers: [
    { code: TriggerCode.TRPR0008 }
  ],
  triggersExcluded: true,
  phase: Phase.HEARING_OUTCOME
}

const generateMockAho = (pncId: string, offences: Offence[], ) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: {
        Result: {
          CJSresultCode: ,
          ResultQualifierVariable: [{ Code: result.resultQualifierVariable }]
        }
          }
        }
      }
    },
    Exceptions: [],
    PncQuery: {
        pncId: pncId
    }
  }) as unknown as AnnotatedHearingOutcome


    it("Should generate trigger TRPR0015 if result code is 4592, the case is recordable, and has triggers"){
        
    }
}) 