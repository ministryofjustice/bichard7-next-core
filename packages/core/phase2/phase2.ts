import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { AnnotatedPNCUpdateDataset } from "../types/AnnotatedPNCUpdateDataset"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./allPncOffencesContainResults"
import checkForOrderVariedRevokedResultCodes from "./checkForOrderVariedRevokedResultCodes"
import getOperationSequence from "./getOperationSequence"
import isAintCase from "./isAintCase"
import isHoAnAppeal from "./isHoAnAppeal"
import isPncUpdateEnabled from "./isPncUpdateEnabled"
import isRecordableOnPnc from "./isRecordableOnPnc"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"

const phase2 = (
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  _auditLogger: AuditLogger
): Phase2Result => {
  try {
    const attributedHearingOutcome = incomingMessage.AnnotatedHearingOutcome.HearingOutcome
    const pncUpdateDataset = structuredClone(incomingMessage) as PncUpdateDataset

    if (!isPncUpdateEnabled(attributedHearingOutcome)) {
      throw Error("To be implemented: isPncUpdateEnabled() === false")
    } else {
      let generateTriggers = false
      const annotatedPncUpdateDataset: AnnotatedPNCUpdateDataset = {
        AnnotatedPNCUpdateDataset: {
          PNCUpdateDataset: structuredClone(pncUpdateDataset)
        }
      }

      if (!isAintCase(attributedHearingOutcome)) {
        const orderVariedRevokedExceptionRaised = checkForOrderVariedRevokedResultCodes(attributedHearingOutcome)
        if (orderVariedRevokedExceptionRaised) {
          throw Error("To be implemented: orderVariedRevokedExceptionRaised === true")
        } else {
          if (isRecordableOnPnc(attributedHearingOutcome)) {
            if (!allPncOffencesContainResults(attributedHearingOutcome)) {
              throw Error("To be implemented: PNCUpdateChoreographyHO.java:179")
            } else {
              const operations = getOperationSequence(attributedHearingOutcome, false)
              if (incomingMessage.HasError) {
                throw Error("To be implemented: PNCUpdateChoreographyHO.java:190")
              } else {
                if (operations.length > 0) {
                  throw Error("To be implemented: PNCUpdateChoreographyHO.java:197")
                } else {
                  if (isHoAnAppeal(attributedHearingOutcome)) {
                    throw Error("To be implemented: PNCUpdateChoreographyHO.java:219")
                  } else {
                    throw Error("To be implemented: PNCUpdateChoreographyHO.java:228")
                  }

                  generateTriggers = true
                }
              }
            }
          } else {
            throw Error("To be implemented: PNCUpdateChoreographyHO.java:245")
          }
        }
      } else {
        throw Error("To be implemented: PNCUpdateChoreographyHO.java:257")

        generateTriggers = true
      }

      if (generateTriggers) {
        throw Error("To be implemented: PNCUpdateChoreographyHO.java:271")
      }
    }
  } catch (error) {
    throw error
  }

  // outputMessage.HasError = false
  // outputMessage.PncOperations = outputMessage.PncOperations || []

  return {
    auditLogEvents: [],
    correlationId: "correlationId",
    outputMessage: pncUpdateDataset,
    triggers: [],
    resultType: Phase2ResultType.success
  }
}

export default phase2
