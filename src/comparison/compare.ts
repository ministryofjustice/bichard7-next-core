import type { Change } from "diff"
import isEqual from "lodash.isequal"
import CoreHandler from "src/index"
import convertAhoToXml from "src/lib/generateLegacyAhoXml"
import { xmlOutputDiff, xmlOutputMatches } from "src/lib/xmlOutputComparison"
import parseAhoXml from "src/parse/parseAhoXml"
import type Exception from "src/types/Exception"
import type { Trigger } from "src/types/Trigger"
import extractExceptionsFromAho from "tests/helpers/extractExceptionsFromAho"
import generateMockPncQueryResultFromAho from "tests/helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "tests/helpers/getPncQueryTimeFromAho"
import MockPncGateway from "tests/helpers/MockPncGateway"
import { processTestString } from "tests/helpers/processTestFile"

type ComparisonResultDebugOutput = {
  triggers: {
    coreResult: Trigger[]
    comparisonResult: Trigger[]
  }
  exceptions: {
    coreResult: Exception[]
    comparisonResult: Exception[]
  }
  xmlOutputDiff: Change[]
  xmlParsingDiff: Change[]
}

export type ComparisonResult = {
  triggersMatch: boolean
  exceptionsMatch: boolean
  xmlOutputMatches: boolean
  xmlParsingMatches: boolean
  debugOutput?: ComparisonResultDebugOutput
}

const compare = (input: string, debug = false): ComparisonResult => {
  const { incomingMessage, annotatedHearingOutcome, triggers } = processTestString(input)
  const response = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
  const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
  const pncGateway = new MockPncGateway(response, pncQueryTime)
  const coreResult = CoreHandler(incomingMessage, pncGateway)
  const exceptions = extractExceptionsFromAho(annotatedHearingOutcome)
  const ahoXml = convertAhoToXml(coreResult.hearingOutcome)
  const parsedAho = parseAhoXml(annotatedHearingOutcome)
  if (parsedAho instanceof Error) {
    throw parsedAho
  }
  const generatedXml = convertAhoToXml(parsedAho)

  const debugOutput: ComparisonResultDebugOutput = {
    triggers: {
      coreResult: coreResult.triggers,
      comparisonResult: triggers
    },
    exceptions: {
      coreResult: coreResult.hearingOutcome.Exceptions ?? [],
      comparisonResult: exceptions
    },
    xmlOutputDiff: xmlOutputDiff(ahoXml, annotatedHearingOutcome),
    xmlParsingDiff: xmlOutputDiff(generatedXml, annotatedHearingOutcome)
  }

  return {
    triggersMatch: isEqual(coreResult.triggers, triggers),
    exceptionsMatch: isEqual(coreResult.hearingOutcome.Exceptions, exceptions),
    xmlOutputMatches: xmlOutputMatches(ahoXml, annotatedHearingOutcome),
    xmlParsingMatches: xmlOutputMatches(generatedXml, annotatedHearingOutcome),
    ...(debug && { debugOutput })
  }
}

export default compare
