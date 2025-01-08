import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import parseHearingOutcome from "../../services/parseHearingOutcome"
import dummyAho from "../fixtures/AnnotatedHO1.json"

export const testAhoJsonObj = parseHearingOutcome(dummyAho.hearingOutcomeXml) as AnnotatedHearingOutcome

export const testAhoJsonStr = JSON.parse(JSON.stringify(testAhoJsonObj))

export const testAhoXml = dummyAho.hearingOutcomeXml
