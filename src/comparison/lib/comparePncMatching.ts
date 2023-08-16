import { isMatch } from "lodash"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import { parseAhoXml } from "src/parse/parseAhoXml"
import parseSpiResult from "src/parse/parseSpiResult"
import transformSpiToAho from "src/parse/transformSpiToAho"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import summariseMatching from "tests/helpers/summariseMatching"
import MockPncGateway from "../../../tests/helpers/MockPncGateway"
import generateMockPncQueryResultFromAho from "../../../tests/helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../../../tests/helpers/getPncQueryTimeFromAho"
import CoreHandler from "../../phase1"
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
