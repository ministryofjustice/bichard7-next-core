import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import { offencesHaveEqualResults } from "../../enrichAho/enrichFunctions/matchOffencesToPnc/resultsAreEqual"
import getOffenceCode from "../../lib/offence/getOffenceCode"

const hoOffencesAreEqual = (offence1: Offence, offence2: Offence): boolean =>
  getOffenceCode(offence1) === getOffenceCode(offence2) && offencesHaveEqualResults([offence1, offence2])

export default hoOffencesAreEqual
