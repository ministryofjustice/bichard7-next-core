/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Change } from "diff"
import isEqual from "lodash.isequal"
import orderBy from "lodash.orderby"
import generateMockPncQueryResultFromAho from "../../tests/helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../../tests/helpers/getPncQueryTimeFromAho"
import MockPncGateway from "../../tests/helpers/MockPncGateway"
import { processTestString } from "../../tests/helpers/processTestFile"
import { xmlOutputDiff, xmlOutputMatches } from "../comparison/xmlOutputComparison"
import CoreHandler from "../index"
import { extractExceptionsFromAho, parseAhoXml } from "../parse/parseAhoXml"
import convertAhoToXml from "../serialise/ahoXml/generate"
import type Exception from "../types/Exception"
import type { Trigger } from "../types/Trigger"

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
  error?: unknown
  debugOutput?: ComparisonResultDebugOutput
  file?: string
  skipped?: boolean
}

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])
const sortTriggers = (exceptions: Trigger[]): Trigger[] => orderBy(exceptions, ["code", "offenceSequenceNumber"])

type CompareOptions = {
  defaultStandingDataVersion?: string
}

const compareMessage = (
  input: string,
  debug = false,
  { defaultStandingDataVersion }: CompareOptions = {}
): ComparisonResult => {
  const { incomingMessage, annotatedHearingOutcome, triggers, standingDataVersion } = processTestString(
    input.replace(/Â£/g, "£")
  )

  ;(global as any).dataVersion = standingDataVersion || defaultStandingDataVersion || "latest"

  const sortedTriggers = sortTriggers(triggers)
  const exceptions = extractExceptionsFromAho(annotatedHearingOutcome)
  const sortedExceptions = sortExceptions(exceptions)

  const pncResponse = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
  const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
  const pncGateway = new MockPncGateway(pncResponse, pncQueryTime)

  try {
    const coreResult = CoreHandler(incomingMessage, pncGateway)
    const sortedCoreExceptions = sortExceptions(coreResult.hearingOutcome.Exceptions ?? [])
    const sortedCoreTriggers = sortTriggers(coreResult.triggers)

    const ahoXml = convertAhoToXml(coreResult.hearingOutcome)
    const parsedAho = parseAhoXml(annotatedHearingOutcome)
    if (parsedAho instanceof Error) {
      throw parsedAho
    }
    const generatedXml = convertAhoToXml(parsedAho)

    const debugOutput: ComparisonResultDebugOutput = {
      triggers: {
        coreResult: sortedCoreTriggers,
        comparisonResult: triggers
      },
      exceptions: {
        coreResult: sortedCoreExceptions,
        comparisonResult: exceptions
      },
      xmlOutputDiff: xmlOutputDiff(ahoXml, annotatedHearingOutcome),
      xmlParsingDiff: xmlOutputDiff(generatedXml, annotatedHearingOutcome)
    }

    return {
      triggersMatch: isEqual(sortedCoreTriggers, sortedTriggers),
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      xmlOutputMatches: xmlOutputMatches(ahoXml, annotatedHearingOutcome),
      xmlParsingMatches: xmlOutputMatches(generatedXml, annotatedHearingOutcome),
      ...(debug && { debugOutput })
    }
  } catch (e) {
    return {
      triggersMatch: false,
      exceptionsMatch: false,
      xmlOutputMatches: false,
      xmlParsingMatches: false,
      error: e
    }
  }
}

export default compareMessage
