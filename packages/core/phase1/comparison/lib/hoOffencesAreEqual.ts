import { offencesHaveEqualResults } from "phase1/enrichAho/enrichFunctions/matchOffencesToPnc/resultsAreEqual"
import getOffenceCode from "phase1/lib/offence/getOffenceCode"
import type { Offence } from "types/AnnotatedHearingOutcome"

const hoOffencesAreEqual = (offence1: Offence, offence2: Offence): boolean =>
  getOffenceCode(offence1) === getOffenceCode(offence2) && offencesHaveEqualResults([offence1, offence2])

export default hoOffencesAreEqual
