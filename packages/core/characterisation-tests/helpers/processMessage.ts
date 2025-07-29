import type Phase1Result from "../../phase1/types/Phase1Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import type Phase3Result from "../../phase3/types/Phase3Result"
import type PncUpdateRequestError from "../../phase3/types/PncUpdateRequestError"
import type { ProcessMessageOptions } from "../types/ProcessMessageOptions"

import Phase from "../../types/Phase"
import { processMessageCorePhase1, processMessageCorePhase2, processMessageCorePhase3 } from "./processMessageCore"

export const processPhase1Message = (messageXml: string, options: ProcessMessageOptions = {}): Promise<Phase1Result> =>
  processMessageCorePhase1(messageXml, { phase: Phase.HEARING_OUTCOME, ...options })

export const processPhase2Message = (messageXml: string): Promise<Phase2Result> => processMessageCorePhase2(messageXml)

export const processPhase3Message = (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase3Result | PncUpdateRequestError> =>
  processMessageCorePhase3(messageXml, { phase: Phase.PHASE_3, ...options })
