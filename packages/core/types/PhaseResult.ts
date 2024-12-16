import type Phase1Result from "../phase1/types/Phase1Result"
import type Phase2Result from "../phase2/types/Phase2Result"
import type Phase3Result from "../phase3/types/Phase3Result"
import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"

type PhaseResult = Phase1Result | Phase2Result | Phase3Result

export const getAnnotatedHearingOutcome = (phaseResult: PhaseResult): AnnotatedHearingOutcome => {
  return "hearingOutcome" in phaseResult ? phaseResult.hearingOutcome : phaseResult.outputMessage
}

export default PhaseResult
