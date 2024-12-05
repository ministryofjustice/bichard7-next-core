import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import { PncOperation } from "../../types/PncOperation"
import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"

const HO200114: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  checkClashingCourtCaseOperationsException(
    aho,
    [PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED],
    ExceptionCode.HO200114
  )

export default HO200114
