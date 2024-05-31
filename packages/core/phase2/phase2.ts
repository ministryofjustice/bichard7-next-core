import EventCode from "@moj-bichard7/common/types/EventCode"
import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./allPncOffencesContainResults"
import getOperationSequence from "./getOperationSequence"
import isAintCase from "./isAintCase"
import isHoAnAppeal from "./isHoAnAppeal"
import isPncUpdateEnabled from "./isPncUpdateEnabled"
import isRecordableOnPnc from "./isRecordableOnPnc"
import phase2PncUpdateDataset from "./pncUpdateDataset/phase2PncUpdateDataset"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"
import markErrorAsResolved from "./pncUpdateDataset/markErrorAsResolved"

const phase2Handler = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  if ("PncOperations" in message) {
    return phase2PncUpdateDataset(message, auditLogger)
  } else {
    return phase2(message, auditLogger)
  }
}

const phase2 = (aho: AnnotatedHearingOutcome, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(aho) as PncUpdateDataset
  const attributedHearingOutcome = aho.AnnotatedHearingOutcome.HearingOutcome
  const correlationId = attributedHearingOutcome.Hearing.SourceReference.UniqueID

  auditLogger.info(EventCode.HearingOutcomeReceivedPhase2)

  if (!isPncUpdateEnabled(attributedHearingOutcome)) {
    auditLogger.info(EventCode.IgnoredDisabled)
    markErrorAsResolved(outputMessage)
  } else {
    let generateTriggers = false

    if (!isAintCase(attributedHearingOutcome)) {
      if (isRecordableOnPnc(attributedHearingOutcome)) {
        if (allPncOffencesContainResults(outputMessage)) {
          const operations = getOperationSequence(outputMessage, false)
          if (outputMessage.HasError) {
            outputMessage.PncOperations = []
          } else {
            if (operations.length > 0) {
              outputMessage.PncOperations = operations
              console.log("To be implemented: Publish to PNC update Queue - PNCUpdateChoreographyHO.java:204")
              console.log("To be implemented: withSentToPhase3 - PNCUpdateChoreographyHO.java:205")
              auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
            } else {
              if (isHoAnAppeal(attributedHearingOutcome)) {
                auditLogger.info(EventCode.IgnoredAppeal)
              } else {
                auditLogger.info(EventCode.IgnoredNonrecordable)
              }

              generateTriggers = true
            }
          }
        }
      } else {
        auditLogger.info(EventCode.IgnoredNonrecordable)
      }
    } else {
      auditLogger.info(EventCode.IgnoredAncillary)
      generateTriggers = true
    }

    if (generateTriggers) {
      console.log("To be implemented: PNCUpdateChoreographyHO.java:271")
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
    triggers: [],
    resultType: Phase2ResultType.success
  }
}

export default phase2
export { phase2Handler }
