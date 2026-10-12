import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"

import dummyAho from "../fixtures/AnnotatedHO1.json"
import dummySuspendedSentenceAho from "../fixtures/AnnotatedHOSuspendedSentence.json"
import FakeLogger from "./fakeLogger"

const logger = new FakeLogger()

export const testAhoJsonObj = parseHearingOutcome(dummyAho.hearingOutcomeXml, logger)

export const testAhoJsonStr = JSON.parse(JSON.stringify(testAhoJsonObj))

export const testAhoXml = dummyAho.hearingOutcomeXml

// The following are used in the community sentence report integration tests, includes suspended sentence order result codes and durations
export const testSuspendedSentenceOrderAhoJsonObj = parseHearingOutcome(
  dummySuspendedSentenceAho.hearingOutcomeXml,
  logger
)

export const testSuspendedSentenceOrderAhoJsonStr = JSON.parse(JSON.stringify(testSuspendedSentenceOrderAhoJsonObj))

export const testSuspendedSentenceOrderAhoXml = dummySuspendedSentenceAho.hearingOutcomeXml
