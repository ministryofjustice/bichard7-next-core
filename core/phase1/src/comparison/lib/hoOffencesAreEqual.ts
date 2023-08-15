import { offencesHaveEqualResults } from "core/phase1/src/enrichAho/enrichFunctions/matchOffencesToPnc/resultsAreEqual"
import getOffenceCode from "core/phase1/src/lib/offence/getOffenceCode"
import type { Offence } from "core/phase1/src/types/AnnotatedHearingOutcome"

const hoOffencesAreEqual = (offence1: Offence, offence2: Offence): boolean =>
  getOffenceCode(offence1) === getOffenceCode(offence2) && offencesHaveEqualResults([offence1, offence2])

export default hoOffencesAreEqual
