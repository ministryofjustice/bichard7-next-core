import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import { PncOperation } from "../../types/PncOperation"
import HO200200 from "./HO200200"

const generateExceptionsForOperation = (
  operation: PncOperation,
  hearingOutcome: AnnotatedHearingOutcome
): Exception[] => {
  const exceptions: Exception[] = []
  if (operation !== PncOperation.REMAND) {
    exceptions.push(...HO200200(hearingOutcome))
  }

  return exceptions
}

export default generateExceptionsForOperation
