import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import { PncOperation } from "../../types/PncOperation"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  checkClashingCourtCaseOperationsException(
    aho,
    [PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED],
    ExceptionCode.HO200112
  )

export default generator
