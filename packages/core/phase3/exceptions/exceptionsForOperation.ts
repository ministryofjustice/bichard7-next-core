import HO200200 from "../../phase2/exceptions/HO200200"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import { PncOperation } from "../../types/PncOperation"

const exceptionsForOperation = (operation: PncOperation, hearingOutcome: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  if (operation !== PncOperation.REMAND) {
    exceptions.push(...HO200200(hearingOutcome))
  }

  return exceptions
}

export default exceptionsForOperation
