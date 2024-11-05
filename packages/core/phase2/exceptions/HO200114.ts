import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"
import { PncOperation } from "../../types/PncOperation"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

const HO200114: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  checkClashingCourtCaseOperationsException(
    aho,
    [PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED],
    ExceptionCode.HO200114
  )

export default HO200114
