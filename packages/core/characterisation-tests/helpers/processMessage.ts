import type Phase1Result from "../../phase1/types/Phase1Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import type Phase3Result from "../../phase3/types/Phase3Result"
import type PncUpdateRequestError from "../../phase3/types/PncUpdateRequestError"
import type { ResultedCaseMessageParsedXml } from "../../types/SpiResult"

import Phase from "../../types/Phase"
import processMessageBichard from "./processMessageBichard"
import { processMessageCorePhase1, processMessageCorePhase2, processMessageCorePhase3 } from "./processMessageCore"

export type ProcessMessageOptions = {
  expectRecord?: boolean
  phase?: Phase
  pncAdjudication?: boolean
  pncCaseType?: string
  pncErrorMessage?: string
  pncMessage?: string
  pncOverrides?: Partial<ResultedCaseMessageParsedXml>
  recordable?: boolean
}

export const processPhase1Message = (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase1Result> => {
  if (process.env.USE_BICHARD === "true") {
    return processMessageBichard<Phase1Result>(messageXml, options)
  }

  return processMessageCorePhase1(messageXml, { phase: Phase.HEARING_OUTCOME, ...options })
}

export const processPhase2Message = (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase2Result> => {
  if (process.env.USE_BICHARD === "true") {
    return processMessageBichard<Phase2Result>(messageXml, { phase: Phase.PNC_UPDATE, ...options })
  }

  return processMessageCorePhase2(messageXml)
}

export const processPhase3Message = (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase3Result | PncUpdateRequestError> => {
  if (process.env.USE_BICHARD === "true") {
    return processMessageBichard<Phase3Result>(messageXml, { phase: Phase.PHASE_3, ...options })
  }

  return processMessageCorePhase3(messageXml, { phase: Phase.PHASE_3, ...options })
}
