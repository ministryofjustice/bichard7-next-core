import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { AnnotatedPNCUpdateDataset } from "../types/AnnotatedPNCUpdateDataset"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./allPncOffencesContainResults"
import getOperationSequence from "./getOperationSequence"
import isAintCase from "./isAintCase"
import isHoAnAppeal from "./isHoAnAppeal"
import isPncUpdateEnabled from "./isPncUpdateEnabled"
import isRecordableOnPnc from "./isRecordableOnPnc"
import putPncUpdateError from "./putPncUpdateError"
import phase2PncUpdateDataset from "./pncUpdateDataset/phase2PncUpdateDataset"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"

const phase2Handler = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  if ("PncOperations" in message) {
    return phase2PncUpdateDataset(message, auditLogger)
  } else {
    return phase2(message, auditLogger)
  }
}

const phase2 = (aho: AnnotatedHearingOutcome, _auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(aho) as PncUpdateDataset
  try {
    const attributedHearingOutcome = aho.AnnotatedHearingOutcome.HearingOutcome
    const pncUpdateDataset = structuredClone(aho) as PncUpdateDataset

    if (!isPncUpdateEnabled(attributedHearingOutcome)) {
      throw Error("To be implemented: isPncUpdateEnabled() === false")
    } else {
      let generateTriggers = false
      const annotatedPncUpdateDataset: AnnotatedPNCUpdateDataset = {
        AnnotatedPNCUpdateDataset: {
          PNCUpdateDataset: pncUpdateDataset
        }
      }

      if (!isAintCase(attributedHearingOutcome)) {
        if (isRecordableOnPnc(attributedHearingOutcome)) {
          if (!allPncOffencesContainResults(outputMessage)) {
            putPncUpdateError(annotatedPncUpdateDataset)
          } else {
            const operations = getOperationSequence(outputMessage, false)
            if (outputMessage.HasError) {
              outputMessage.PncOperations = []
              putPncUpdateError(annotatedPncUpdateDataset)
            } else {
              if (operations.length > 0) {
                outputMessage.PncOperations = operations
                console.log("To be implemented: Publish to PNC update Queue - PNCUpdateChoreographyHO.java:204")
                console.log("To be implemented: withSentToPhase3 - PNCUpdateChoreographyHO.java:205")
                console.log("To be implemented: withAuditLog - PNCUpdateChoreographyHO.java:206")
              } else {
                if (isHoAnAppeal(attributedHearingOutcome)) {
                  throw Error("To be implemented: PNCUpdateChoreographyHO.java:219")
                } else {
                  console.log("To be implemented: withAuditLog - PNCUpdateChoreographyHO.java:228")
                }

                generateTriggers = true
              }
            }
          }
        } else {
          console.log("To be implemented: PNCUpdateChoreographyHO.java:245")
        }
      } else {
        console.log("To be implemented: PNCUpdateChoreographyHO.java:257")

        generateTriggers = true
      }

      if (generateTriggers) {
        console.log("To be implemented: PNCUpdateChoreographyHO.java:271")
      }
    }
  } catch (error) {
    console.log("Phase 2 processing error to be implemented: ", error)
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

export default phase2
export { phase2Handler }
