import type { Change } from "diff"
import isEqual from "lodash.isequal"
import orderBy from "lodash.orderby"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import logger from "src/lib/logging"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { Phase1ResultType } from "src/types/Phase1Result"
import generateMockPncQueryResultFromAho from "../../../tests/helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../../../tests/helpers/getPncQueryTimeFromAho"
import MockPncGateway from "../../../tests/helpers/MockPncGateway"
import { processTestString } from "../../../tests/helpers/processTestFile"
import CoreHandler from "../../index"
import { extractExceptionsFromAho, parseAhoXml } from "../../parse/parseAhoXml"
import convertAhoToXml from "../../serialise/ahoXml/generate"
import type Exception from "../../types/Exception"
import type { Trigger } from "../../types/Trigger"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"

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

const hasOffences = (aho: AnnotatedHearingOutcome): boolean =>
  !!(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence?.length > 0)

const compareMessage = async (
  input: string,
  debug = false,
  { defaultStandingDataVersion }: CompareOptions = {}
): Promise<ComparisonResult> => {
  const { incomingMessage, annotatedHearingOutcome, triggers, standingDataVersion } = processTestString(
    input.replace(/Â£/g, "£")
  )

  const dataVersion = standingDataVersion || defaultStandingDataVersion || "latest"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).dataVersion = dataVersion
  if (debug) {
    logger.info(`Using version ${dataVersion} of standing data`)
  }

  const sortedTriggers = sortTriggers(triggers)
  const exceptions = extractExceptionsFromAho(annotatedHearingOutcome)
  const sortedExceptions = sortExceptions(exceptions)

  const pncResponse = generateMockPncQueryResultFromAho(annotatedHearingOutcome)
  const pncQueryTime = getPncQueryTimeFromAho(annotatedHearingOutcome)
  const pncGateway = new MockPncGateway(pncResponse, pncQueryTime)
  const auditLogger = new CoreAuditLogger()

  try {
    const coreResult = await CoreHandler(incomingMessage, pncGateway, auditLogger)
    if (coreResult.resultType === Phase1ResultType.failure) {
      throw Error("Failed to process")
    }

    const sortedCoreExceptions = sortExceptions(coreResult.hearingOutcome.Exceptions ?? [])
    const sortedCoreTriggers = sortTriggers(coreResult.triggers)

    const ahoXml = convertAhoToXml(coreResult.hearingOutcome)
    const parsedAho = parseAhoXml(annotatedHearingOutcome)
    if (parsedAho instanceof Error) {
      throw parsedAho
    }

    const isIgnored = !hasOffences(parsedAho)
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
      xmlOutputMatches: isIgnored
        ? !hasOffences(coreResult.hearingOutcome)
        : xmlOutputMatches(ahoXml, annotatedHearingOutcome),
      xmlParsingMatches: isIgnored ? true : xmlOutputMatches(generatedXml, annotatedHearingOutcome),
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
