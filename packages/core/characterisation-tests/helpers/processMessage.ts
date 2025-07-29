import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"

import type Phase1Result from "../../phase1/types/Phase1Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import type Phase3Result from "../../phase3/types/Phase3Result"
import type PncUpdateRequestError from "../../phase3/types/PncUpdateRequestError"
import type { ProcessMessageOptions } from "../types/ProcessMessageOptions"

import CoreAuditLogger from "../../lib/auditLog/CoreAuditLogger"
import CorePhase1 from "../../phase1/phase1"
import CorePhase2 from "../../phase2/phase2"
import parseIncomingMessage from "../../tests/helpers/parseIncomingMessage"
import Phase from "../../types/Phase"
import { createMockPncGateway, processMessageCorePhase3 } from "./processMessageCore"

export const processPhase1Message = async (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase1Result> => {
  const { message: incomingMessage } = parseIncomingMessage(messageXml)
  const pncGateway = createMockPncGateway(messageXml, { phase: Phase.HEARING_OUTCOME, ...options })
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

  return await CorePhase1(incomingMessage, pncGateway, auditLogger)
}

export const processPhase2Message = (messageXml: string): Phase2Result => {
  const { message: incomingMessage } = parseIncomingMessage(messageXml)
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)

  return CorePhase2(incomingMessage, auditLogger)
}

export const processPhase3Message = (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase3Result | PncUpdateRequestError> =>
  processMessageCorePhase3(messageXml, { phase: Phase.PHASE_3, ...options })
