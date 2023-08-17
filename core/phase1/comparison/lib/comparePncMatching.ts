import CoreAuditLogger from "core/common/CoreAuditLogger"
import summariseMatching from "core/phase1/tests/helpers/summariseMatching"
import type { Phase1SuccessResult } from "core/phase1/types/Phase1Result"
import { isMatch } from "lodash"
import { parseAhoXml } from "../../parse/parseAhoXml"
import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import CoreHandler from "../../phase1"
import MockPncGateway from "../../tests/helpers/MockPncGateway"
import generateMockPncQueryResultFromAho from "../../tests/helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../../tests/helpers/getPncQueryTimeFromAho"
import type { OldPhase1Comparison, Phase1Comparison } from "../types/ComparisonFile"
import type PncComparisonResultDetail from "../types/PncComparisonResultDetail"
import { isError } from "../types/Result"

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
  const auditLogger = new CoreAuditLogger()
  const incomingSpi = parseSpiResult(incomingMessage)
  const incomingAho = transformSpiToAho(incomingSpi)
  const coreResult = (await CoreHandler(incomingAho, pncGateway, auditLogger)) as Phase1SuccessResult
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
