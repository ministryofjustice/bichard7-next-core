import EventCode from "@moj-bichard7/common/types/EventCode"
import generateTriggers from "../../phase1/triggers/generate"
import type AuditLogger from "../../phase1/types/AuditLogger"
import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import allPncOffencesContainResults from "../allPncOffencesContainResults"
import getOperationSequence from "../getOperationSequence"
import type Phase2Result from "../types/Phase2Result"
import { Phase2ResultType } from "../types/Phase2Result"
import checkForOrderVariedRevokedResultCodes from "./checkForOrderVariedRevokedResultCodes"
import refreshOperationSequence from "./refreshOperationSequence"

const initialiseOutputMessage = (inputMessage: PncUpdateDataset): PncUpdateDataset => {
  const outputMessage = structuredClone(inputMessage)
  outputMessage.HasError = false
  return outputMessage
}

const phase2PncUpdateDataset = (pncUpdateDataset: PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = initialiseOutputMessage(pncUpdateDataset)
  const correlationId = outputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  let triggers: Trigger[] = []

  auditLogger.info(EventCode.ReceivedResubmittedHearingOutcome)

  const orderVariedRevokedExceptionRaised = checkForOrderVariedRevokedResultCodes(outputMessage)
  const allOffencesContainResults = allPncOffencesContainResults(outputMessage)

  if (!orderVariedRevokedExceptionRaised && allOffencesContainResults) {
    if (outputMessage.PncOperations.length === 0) {
      const operations = getOperationSequence(outputMessage, true)

      if (outputMessage.Exceptions.length === 0) {
        if (operations.length > 0) {
          outputMessage.PncOperations.push(...operations)
        } else {
          triggers = generateTriggers(pncUpdateDataset, true)
        }
      }
    } else {
      refreshOperationSequence(outputMessage)
    }

    if (outputMessage.PncOperations.length > 0) {
      auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
    }
  }

  outputMessage.HasError = false
  if (!outputMessage.PncOperations) {
    outputMessage.PncOperations = []
  }

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    triggers,
    resultType: Phase2ResultType.success
  }
}

export default phase2PncUpdateDataset
