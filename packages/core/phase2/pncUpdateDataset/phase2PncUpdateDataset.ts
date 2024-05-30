import EventCode from "@moj-bichard7/common/types/EventCode"
import type AuditLogger from "../../phase1/types/AuditLogger"
import type { AnnotatedPNCUpdateDataset } from "../../types/AnnotatedPNCUpdateDataset"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import allPncOffencesContainResults from "../allPncOffencesContainResults"
import getOperationSequence from "../getOperationSequence"
import putPncUpdateError from "../putPncUpdateError"
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

const phase2PncUpdateDataset = (pncUpdateDataset: PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(pncUpdateDataset)
  let annotatedPncUpdateDataset = {} as AnnotatedPNCUpdateDataset

  try {
    auditLogger.info(EventCode.ReceivedResubmittedHearingOutcome)

    const orderVariedRevokedExceptionRaised = checkForOrderVariedRevokedResultCodes(outputMessage)
    const allOffencesContainResults = allPncOffencesContainResults(pncUpdateDataset)

    if (orderVariedRevokedExceptionRaised || !allOffencesContainResults) {
      annotatedPncUpdateDataset = getAnnotatedDatasetFromDataset(pncUpdateDataset)
      putPncUpdateError(annotatedPncUpdateDataset)
    } else {
      if (pncUpdateDataset.PncOperations.length === 0) {
        const operations = getOperationSequence(pncUpdateDataset, true)

        if (pncUpdateDataset.Exceptions.length > 0) {
          console.log("To be implemented: PNCUpdateChoreographyDS.java:135")
        } else {
          if (operations.length > 0) {
            console.log("To be implemented: PNCUpdateChoreographyDS.java:150")
          } else {
            const postUpdateTriggersArray = identifyPostUpdateTriggers(pncUpdateDataset)
            const preUpdateTriggersArray = identifyPreUpdateTriggers(pncUpdateDataset)
            const triggersList = combineTriggerLists(preUpdateTriggersArray, postUpdateTriggersArray)

            markErrorAsResolved(pncUpdateDataset)
            putTriggerEvent(annotatedPncUpdateDataset, triggersList)
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
  } catch (error) {
    console.log("Phase 2 PncUpdateDataset processing error to be implemented: ", error)
    console.log("To be implemented: PNCUpdateChoreographyDSBean.java:162")
  }

  outputMessage.HasError = false
  if (!outputMessage.PncOperations) {
    outputMessage.PncOperations = []
  }

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId: "correlationId",
    outputMessage,
    triggers: [],
    resultType: Phase2ResultType.success
  }
}

export default phase2PncUpdateDataset
