import EventCode from "@moj-bichard7/common/types/EventCode"
import generateTriggers from "../../phase1/triggers/generate"
import type AuditLogger from "../../phase1/types/AuditLogger"
import type { Trigger } from "../../phase1/types/Trigger"
import Phase from "../../types/Phase"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import allPncOffencesContainResults from "../allPncOffencesContainResults"
import getOperationSequence from "../getOperationSequence"
import type Phase2Result from "../types/Phase2Result"
import { Phase2ResultType } from "../types/Phase2Result"
import refreshOperationSequence from "./refreshOperationSequence"

const initialiseOutputMessage = (pncUpdateDataset: PncUpdateDataset): PncUpdateDataset => {
  const outputMessage = structuredClone(pncUpdateDataset)
  outputMessage.HasError = false
  return outputMessage
}

const processPhase2PncUpdateDataset = (pncUpdateDataset: PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = initialiseOutputMessage(pncUpdateDataset)
  const correlationId = outputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  let triggers: Trigger[] = []

  auditLogger.info(EventCode.ReceivedResubmittedHearingOutcome)

  const allOffencesContainResults = allPncOffencesContainResults(outputMessage)

  if (allOffencesContainResults) {
    if (outputMessage.PncOperations.length === 0) {
      const operations = getOperationSequence(outputMessage, true)

      if (outputMessage.Exceptions.length === 0) {
        if (operations.length > 0) {
          outputMessage.PncOperations.push(...operations)
        } else {
          triggers = generateTriggers(pncUpdateDataset, Phase.PNC_UPDATE)
        }
      }
    } else {
      refreshOperationSequence(outputMessage)
      auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
    }
  }

  outputMessage.HasError = false

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    triggers,
    resultType: Phase2ResultType.success
  }
}

export default processPhase2PncUpdateDataset
