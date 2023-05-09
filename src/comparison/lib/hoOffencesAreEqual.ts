import { offencesHaveEqualResults } from "src/enrichAho/enrichFunctions/enrichCourtCases/offenceMatcher/resultsAreEqual"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { Offence } from "src/types/AnnotatedHearingOutcome"

const hoOffencesAreEqual = (offence1: Offence, offence2: Offence): boolean =>
  getOffenceCode(offence1) === getOffenceCode(offence2) && offencesHaveEqualResults([offence1, offence2])

export default hoOffencesAreEqual
