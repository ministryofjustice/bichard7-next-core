import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import checkClashingCourtCaseOperationsException from "./checkClashingCourtCaseOperationsException"

const HO200112: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  checkClashingCourtCaseOperationsException(
    aho,
    [PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED],
    ExceptionCode.HO200112
  )

export default HO200112
