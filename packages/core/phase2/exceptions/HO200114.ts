import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"

const HO200114: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  checkClashingCourtCaseOperationsException(
    aho,
    [PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED],
    ExceptionCode.HO200114
  )

export default HO200114
