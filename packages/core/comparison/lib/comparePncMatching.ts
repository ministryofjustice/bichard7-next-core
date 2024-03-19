import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import isMatch from "lodash.ismatch"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import { parseAhoXml } from "../../phase1/parse/parseAhoXml"
import parseIncomingMessage from "./parseIncomingMessage"
import CorePhase1 from "../../phase1/phase1"
import type { OldPhase1Comparison, Phase1Comparison } from "../types/ComparisonFile"
import type PncComparisonResultDetail from "../types/PncComparisonResultDetail"
import MockPncGateway from "./MockPncGateway"
import generateMockPncQueryResultFromAho from "./generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "./getPncQueryTimeFromAho"
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
