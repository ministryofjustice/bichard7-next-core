import EventCode from "@moj-bichard7/common/types/EventCode"
import type AuditLogger from "../../phase1/types/AuditLogger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import allPncOffencesContainResults from "../allPncOffencesContainResults"
import getOperationSequence from "../getOperationSequence"
import type Phase2Result from "../types/Phase2Result"
import { Phase2ResultType } from "../types/Phase2Result"
import checkForOrderVariedRevokedResultCodes from "./checkForOrderVariedRevokedResultCodes"
import combineTriggerLists from "./combineTriggerLists"
import getAnnotatedDatasetFromDataset from "./getAnnotatedDatasetFromDataset"
import identifyPostUpdateTriggers from "./identifyPostUpdateTriggers"
import identifyPreUpdateTriggers from "./identifyPreUpdateTriggers"
import markErrorAsResolved from "./markErrorAsResolved"
import putTriggerEvent from "./putTriggerEvent"
import refreshOperationSequence from "./refreshOperationSequence"
import type { Trigger } from "../../phase1/types/Trigger"

const phase2PncUpdateDataset = (pncUpdateDataset: PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(pncUpdateDataset)
  let triggers: Trigger[] = []

  auditLogger.info(EventCode.ReceivedResubmittedHearingOutcome)

  const orderVariedRevokedExceptionRaised = checkForOrderVariedRevokedResultCodes(outputMessage)
  const allOffencesContainResults = allPncOffencesContainResults(outputMessage)

  if (!orderVariedRevokedExceptionRaised && allOffencesContainResults) {
    if (pncUpdateDataset.PncOperations.length === 0) {
      const operations = getOperationSequence(pncUpdateDataset, true)

      if (pncUpdateDataset.Exceptions.length === 0) {
        if (operations.length > 0) {
          console.log("To be implemented: PNCUpdateChoreographyDS.java:150")
        } else {
          const postUpdateTriggersArray = identifyPostUpdateTriggers(pncUpdateDataset)
          const preUpdateTriggersArray = identifyPreUpdateTriggers(pncUpdateDataset)
          triggers = combineTriggerLists(preUpdateTriggersArray, postUpdateTriggersArray)

          markErrorAsResolved(pncUpdateDataset)
          putTriggerEvent(getAnnotatedDatasetFromDataset(outputMessage), triggers)
          markErrorAsResolved(pncUpdateDataset)
        }
      }
    } else {
      refreshOperationSequence(pncUpdateDataset)
    }

    if (pncUpdateDataset.PncOperations.length > 0) {
      console.log("To be implemented: PNCUpdateChoreographyDS.java:205")
    }
  }

  outputMessage.HasError = false
  if (!outputMessage.PncOperations) {
    outputMessage.PncOperations = []
  }

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId: "correlationId",
    outputMessage,
    triggers,
    resultType: Phase2ResultType.success
  }
}

export default phase2PncUpdateDataset
