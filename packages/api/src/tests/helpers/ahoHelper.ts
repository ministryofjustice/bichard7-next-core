import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import parseHearingOutcome from "../../services/parseHearingOutcome"
import dummyAho from "../fixtures/AnnotatedHO1.json"

const testAho = parseHearingOutcome(dummyAho.hearingOutcomeXml) as AnnotatedHearingOutcome

export default testAho
