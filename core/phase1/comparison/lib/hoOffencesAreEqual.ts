import type { Offence } from "core/common/types/AnnotatedHearingOutcome"
import { offencesHaveEqualResults } from "core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/resultsAreEqual"
import getOffenceCode from "core/phase1/lib/offence/getOffenceCode"

const hoOffencesAreEqual = (offence1: Offence, offence2: Offence): boolean =>
  getOffenceCode(offence1) === getOffenceCode(offence2) && offencesHaveEqualResults([offence1, offence2])

export default hoOffencesAreEqual
