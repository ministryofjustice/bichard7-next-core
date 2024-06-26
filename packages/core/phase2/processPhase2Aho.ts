import EventCode from "@moj-bichard7/common/types/EventCode"
import generateTriggers from "../phase1/triggers/generate"
import type AuditLogger from "../phase1/types/AuditLogger"
import type { Trigger } from "../phase1/types/Trigger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import Phase from "../types/Phase"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./allPncOffencesContainResults"
import getOperationSequence from "./getOperationSequence"
import isAintCase from "./isAintCase"
import isPncUpdateEnabled from "./isPncUpdateEnabled"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"

const initialisePncUpdateDatasetFromAho = (aho: AnnotatedHearingOutcome): PncUpdateDataset => {
  const pncUpdateDataset = structuredClone(aho) as PncUpdateDataset
  pncUpdateDataset.PncOperations = []
  return pncUpdateDataset
}

const processPhase2Aho = (aho: AnnotatedHearingOutcome, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = initialisePncUpdateDatasetFromAho(aho)

  const attributedHearingOutcome = aho.AnnotatedHearingOutcome.HearingOutcome
  const correlationId = attributedHearingOutcome.Hearing.SourceReference.UniqueID

  let triggers: Trigger[] = []

  auditLogger.info(EventCode.HearingOutcomeReceivedPhase2)

  if (!isPncUpdateEnabled(attributedHearingOutcome)) {
    auditLogger.info(EventCode.IgnoredDisabled)
    outputMessage.HasError = false

    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      triggers: [],
      resultType: Phase2ResultType.success
    }
  }

  const isRecordableOnPnc = !!attributedHearingOutcome.Case.RecordableOnPNCindicator
  let shouldGenerateTriggers = false

  if (isAintCase(attributedHearingOutcome)) {
    auditLogger.info(EventCode.IgnoredAncillary)
    shouldGenerateTriggers = true
  } else if (!isRecordableOnPnc) {
    auditLogger.info(EventCode.IgnoredNonrecordable)
  } else if (allPncOffencesContainResults(outputMessage)) {
    const operations = getOperationSequence(outputMessage, false)
    if (!outputMessage.HasError) {
      if (operations.length > 0) {
        outputMessage.PncOperations = operations
        // Publish to PNC update Queue happens here in old Bichard - PNCUpdateChoreographyHO.java:204
        // withSentToPhase3 happens here in old Bichard - PNCUpdateChoreographyHO.java:205
        auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
      } else {
        auditLogger.info(EventCode.IgnoredNonrecordable)
        shouldGenerateTriggers = true
      }
    }
  }

  if (shouldGenerateTriggers) {
    triggers = generateTriggers(outputMessage, Phase.PNC_UPDATE)
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

export default processPhase2Aho
