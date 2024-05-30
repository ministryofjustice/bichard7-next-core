import type { AnnotatedPNCUpdateDataset } from "../../types/AnnotatedPNCUpdateDataset"
import getRecordId from "./getRecordID"
import insertPncUpdateError from "./insertPncUpdateError"
import revisePncUpdateError from "./revisePncUpdateError"

const METHOD_NAME = "putPNCUpdateError"
const MESSAGE_ID_SIZE = 70
const RECORD_NOT_FOUND = -1

const putPncUpdateError = (annotatedDataset: AnnotatedPNCUpdateDataset) => {
  const messageId =
    annotatedDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID.slice(
      0,
      MESSAGE_ID_SIZE
    )

  const errorId: number = getRecordId(messageId)

  const message = `${METHOD_NAME}: Looked up error ID for message Id '${messageId}', the result is ${errorId}`
  if (errorId === RECORD_NOT_FOUND) {
    message.concat(" (not found)")
  }

  try {
    if (errorId === RECORD_NOT_FOUND) {
      insertPncUpdateError(annotatedDataset)
    } else {
      revisePncUpdateError(errorId, annotatedDataset)
    }
  } catch (err) {
    console.log("to be implemented: ErrorListServicesImpl.java:471")
  }
}

export default putPncUpdateError
