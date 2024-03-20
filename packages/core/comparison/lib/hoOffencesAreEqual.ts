import type { Offence } from "../../types/AnnotatedHearingOutcome"
import getOffenceCode from "../../phase1/lib/offence/getOffenceCode"
import offencesHaveEqualResults from "../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offencesHaveEqualResults"

const hoOffencesAreEqual = (offence1: Offence, offence2: Offence): boolean =>
  getOffenceCode(offence1) === getOffenceCode(offence2) && offencesHaveEqualResults([offence1, offence2])

export default hoOffencesAreEqual
