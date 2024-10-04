import type Phase1Result from "../../phase1/types/Phase1Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import Phase from "../../types/Phase"
import type { ResultedCaseMessageParsedXml } from "../../types/SpiResult"
import processMessageBichard from "./processMessageBichard"
import { processMessageCorePhase1, processMessageCorePhase2 } from "./processMessageCore"

export type ProcessMessageOptions = {
  expectRecord?: boolean
  recordable?: boolean
  pncCaseType?: string
  pncOverrides?: Partial<ResultedCaseMessageParsedXml>
  pncMessage?: string
  pncAdjudication?: boolean
  phase?: Phase
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
