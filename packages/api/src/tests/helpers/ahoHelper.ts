import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"

import dummyAho from "../fixtures/AnnotatedHO1.json"
import FakeLogger from "./fakeLogger"

const logger = new FakeLogger()

export const testAhoJsonObj = parseHearingOutcome(dummyAho.hearingOutcomeXml, logger) as AnnotatedHearingOutcome

export const testAhoJsonStr = JSON.parse(JSON.stringify(testAhoJsonObj))

export const testAhoXml = dummyAho.hearingOutcomeXml
