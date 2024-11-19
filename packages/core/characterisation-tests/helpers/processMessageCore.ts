import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import MockPncGateway from "../../comparison/lib/MockPncGateway"
import parseIncomingMessage from "../../comparison/lib/parseIncomingMessage"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import CorePhase1 from "../../phase1/phase1"
import type Phase1Result from "../../phase1/types/Phase1Result"
import CorePhase2 from "../../phase2/phase2"
import type Phase2Result from "../../phase2/types/Phase2Result"
import generateMockPncQueryResult from "./generateMockPncQueryResult"
import type { ProcessMessageOptions } from "./processMessage"

export const processMessageCorePhase1 = async (
  messageXml: string,
  {
    recordable = true,
    pncOverrides = {},
    pncCaseType = "court",
    pncMessage,
    pncAdjudication = false
  }: ProcessMessageOptions
): Promise<Phase1Result> => {
  const pncQueryResult = recordable
    ? generateMockPncQueryResult(pncMessage ? pncMessage : messageXml, pncOverrides, pncCaseType, pncAdjudication)
    : undefined
  const pncGateway = new MockPncGateway(pncQueryResult)

  const { message: incomingMessage } = parseIncomingMessage(messageXml)

  const auditLogEventSource = AuditLogEventSource.CorePhase1
  const auditLogger = new CoreAuditLogger(auditLogEventSource)

  return await CorePhase1(incomingMessage, pncGateway, auditLogger)
}

// eslint-disable-next-line require-await
export const processMessageCorePhase2 = async (messageXml: string): Promise<Phase2Result> => {
  const { message: incomingMessage } = parseIncomingMessage(messageXml)

  const auditLogEventSource = AuditLogEventSource.CorePhase2
  const auditLogger = new CoreAuditLogger(auditLogEventSource)

  return Promise.resolve(CorePhase2(incomingMessage, auditLogger))
}
