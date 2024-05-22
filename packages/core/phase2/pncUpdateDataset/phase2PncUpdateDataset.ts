import AuditLogger from "../../phase1/types/AuditLogger"
import { PncUpdateDataset } from "../../types/PncUpdateDataset"
import allPncOffencesContainResults from "../allPncOffencesContainResults"
import getOperationSequence from "../getOperationSequence"
import Phase2Result, { Phase2ResultType } from "../types/Phase2Result"
import checkForOrderVariedRevokedResultCodes from "./checkForOrderVariedRevokedResultCodes"
import refreshOperationSequence from "./refreshOperationSequence"

const phase2PncUpdateDataset = (pncUpdateDataset: PncUpdateDataset, _auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(pncUpdateDataset)
  try {
    console.log("To be implemented: PNCUpdateChoreographyDS.java:103")

    const orderVariedRevokedExceptionRaised = checkForOrderVariedRevokedResultCodes(pncUpdateDataset)
    const allOffencesContainResults = allPncOffencesContainResults(pncUpdateDataset)

    if(orderVariedRevokedExceptionRaised || !allOffencesContainResults) {
      console.log("To be implemented: PNCUpdateChoreographyDS.java:121")
    } else {
      if(pncUpdateDataset.PncOperations.length === 0) {
        const operations = getOperationSequence(pncUpdateDataset, true)

        if(pncUpdateDataset.Exceptions.length > 0) {
          console.log("To be implemented: PNCUpdateChoreographyDS.java:135")
        } else {
          if(operations.length > 0) {
            console.log("To be implemented: PNCUpdateChoreographyDS.java:150")
          } else {
            console.log("To be implemented: PNCUpdateChoreographyDS.java:159")
          }
        }
      } else {
        refreshOperationSequence(pncUpdateDataset, pncUpdateDataset.PncOperations)
      }

      if(pncUpdateDataset.PncOperations.length > 0) {
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
    auditLogEvents: [],
    correlationId: "correlationId",
    outputMessage,
    triggers: [],
    resultType: Phase2ResultType.success
  }
}

export default phase2PncUpdateDataset
