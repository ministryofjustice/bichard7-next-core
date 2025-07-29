import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"

import type Phase1Result from "../../phase1/types/Phase1Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import type Phase3Result from "../../phase3/types/Phase3Result"
import type PncUpdateRequestError from "../../phase3/types/PncUpdateRequestError"
import type { ProcessMessageOptions } from "../types/ProcessMessageOptions"

import CoreAuditLogger from "../../lib/auditLog/CoreAuditLogger"
import CorePhase1 from "../../phase1/phase1"
import parseIncomingMessage from "../../tests/helpers/parseIncomingMessage"
import Phase from "../../types/Phase"
import { createMockPncGateway, processMessageCorePhase2, processMessageCorePhase3 } from "./processMessageCore"

export const processPhase1Message = async (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase1Result> => {
  const { message: incomingMessage } = parseIncomingMessage(messageXml)
  const pncGateway = createMockPncGateway(messageXml, { phase: Phase.HEARING_OUTCOME, ...options })
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

  return await CorePhase1(incomingMessage, pncGateway, auditLogger)
}

export const processPhase2Message = (messageXml: string): Promise<Phase2Result> => processMessageCorePhase2(messageXml)

export const processPhase3Message = (
  messageXml: string,
  options: ProcessMessageOptions = {}
): Promise<Phase3Result | PncUpdateRequestError> =>
  processMessageCorePhase3(messageXml, { phase: Phase.PHASE_3, ...options })
