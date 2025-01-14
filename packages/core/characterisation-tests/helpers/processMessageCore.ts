import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"

import type Phase1Result from "../../phase1/types/Phase1Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import type Phase3Result from "../../phase3/types/Phase3Result"
import type PncUpdateRequestError from "../../phase3/types/PncUpdateRequestError"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { ProcessMessageOptions } from "./processMessage"

import MockPncGateway from "../../comparison/lib/MockPncGateway"
import parseIncomingMessage from "../../comparison/lib/parseIncomingMessage"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import { PncApiError } from "../../lib/PncGateway"
import CorePhase1 from "../../phase1/phase1"
import CorePhase2 from "../../phase2/phase2"
import CorePhase3 from "../../phase3/phase3"
import generateMockPncQueryResult from "./generateMockPncQueryResult"

export const processMessageCorePhase1 = async (
  messageXml: string,
  {
    recordable = true,
    pncOverrides = {},
    pncCaseType = "court",
    pncErrorMessage,
    pncMessage,
    pncAdjudication = false
  }: ProcessMessageOptions
): Promise<Phase1Result> => {
  const pncQueryResult = recordable
    ? pncErrorMessage
      ? new PncApiError([pncErrorMessage])
      : generateMockPncQueryResult(pncMessage ? pncMessage : messageXml, pncOverrides, pncCaseType, pncAdjudication)
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

export const processMessageCorePhase3 = async (
  messageXml: string,
  {
    recordable = true,
    pncOverrides = {},
    pncCaseType = "court",
    pncErrorMessage,
    pncMessage,
    pncAdjudication = false
  }: ProcessMessageOptions
): Promise<Phase3Result | PncUpdateRequestError> => {
  const pncQueryResult = recordable
    ? pncErrorMessage
      ? new PncApiError([pncErrorMessage])
      : generateMockPncQueryResult(pncMessage ? pncMessage : messageXml, pncOverrides, pncCaseType, pncAdjudication)
    : undefined
  const pncGateway = new MockPncGateway(pncQueryResult)

  const { message: incomingMessage } = parseIncomingMessage(messageXml)

  const auditLogEventSource = AuditLogEventSource.CorePhase3
  const auditLogger = new CoreAuditLogger(auditLogEventSource)

  return await CorePhase3(incomingMessage as PncUpdateDataset, pncGateway, auditLogger)
}
