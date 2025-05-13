import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import isMatch from "lodash.ismatch"

import type { OldPhase1Comparison, Phase1Comparison } from "../../tests/types/ComparisonFile"
import type PncComparisonResultDetail from "../types/PncComparisonResultDetail"

import CoreAuditLogger from "../../lib/auditLog/CoreAuditLogger"
import { parseAhoXml } from "../../lib/parse/parseAhoXml"
import CorePhase1 from "../../phase1/phase1"
import generateMockPncQueryResultFromAho from "../../tests/helpers/comparison/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../../tests/helpers/comparison/getPncQueryTimeFromAho"
import parseIncomingMessage from "../../tests/helpers/comparison/parseIncomingMessage"
import MockPncGateway from "../../tests/helpers/MockPncGateway"
import summariseMatching from "./summariseMatching"

type CompareOptions = {
  defaultStandingDataVersion?: string
}

const comparePncMatching = async (
  comparison: OldPhase1Comparison | Phase1Comparison,
  { defaultStandingDataVersion }: CompareOptions = {}
): Promise<PncComparisonResultDetail> => {
  const { incomingMessage, annotatedHearingOutcome, standingDataVersion } = comparison
  const dataVersion = standingDataVersion || defaultStandingDataVersion || "latest"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).dataVersion = dataVersion

  const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
  const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
  const pncGateway = new MockPncGateway(response, pncQueryTime)
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
  const { message: incomingAho, type } = parseIncomingMessage(incomingMessage)
  if (type === "PncUpdateDataset") {
    throw new Error("Received invalid incoming message")
  }

  const coreResult = await CorePhase1(incomingAho, pncGateway, auditLogger)
  const expectedAho = parseAhoXml(annotatedHearingOutcome)
  if (isError(expectedAho)) {
    throw expectedAho as Error
  }

  const expectedMatch = summariseMatching(expectedAho)
  const actualMatch = summariseMatching(coreResult.hearingOutcome)

  let pass = expectedMatch === actualMatch
  if (!pass && expectedMatch && actualMatch) {
    pass = isMatch(expectedMatch, actualMatch)
  }

  return {
    pass,
    expected: expectedMatch,
    actual: actualMatch
  }
}

export default comparePncMatching
