import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"
import { PncOperation } from "../../types/PncOperation"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  checkClashingCourtCaseOperationsException(
    aho,
    [PncOperation.NORMAL_DISPOSAL, PncOperation.DISPOSAL_UPDATED],
    ExceptionCode.HO200115
  )

export default generator
