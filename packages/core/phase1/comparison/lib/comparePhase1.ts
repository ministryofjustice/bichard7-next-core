import CoreAuditLogger from "core/common/CoreAuditLogger"
import type { AnnotatedHearingOutcome } from "core/common/types/AnnotatedHearingOutcome"
import { TriggerCode } from "core/common/types/TriggerCode"
import { matchingExceptions } from "core/phase1/tests/helpers/summariseMatching"
import { Phase1ResultType } from "core/phase1/types/Phase1Result"
import isEqual from "lodash.isequal"
import orderBy from "lodash.orderby"
import logger from "../../lib/logging"
import { extractExceptionsFromAho, parseAhoXml } from "../../parse/parseAhoXml"
import parseIncomingMessage from "../../parse/parseIncomingMessage"
import phase1Handler from "../../phase1"
import convertAhoToXml from "../../serialise/ahoXml/generate"
import MockPncGateway from "../../tests/helpers/MockPncGateway"
import generateMockPncQueryResultFromAho from "../../tests/helpers/generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "../../tests/helpers/getPncQueryTimeFromAho"
import type Exception from "../../types/Exception"
import type { Trigger } from "../../types/Trigger"
import type { OldPhase1Comparison, Phase1Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"
import isIntentionalMatchingDifference from "./isIntentionalMatchingDifference"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])
const sortTriggers = (triggers: Trigger[]): Trigger[] => orderBy(triggers, ["code", "offenceSequenceNumber"])

type CompareOptions = {
  defaultStandingDataVersion?: string
}

const hasOffences = (aho: AnnotatedHearingOutcome): boolean =>
  !!(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence?.length > 0)

const getCorrelationId = (comparison: OldPhase1Comparison | Phase1Comparison): string | undefined => {
  if ("correlationId" in comparison) {
    return comparison.correlationId
  }
  const spiMatch = comparison.incomingMessage.match(
    /<msg:MessageIdentifier>(?<correlationId>[^<]*)<\/msg:MessageIdentifier>/
  )
  if (spiMatch) {
    return spiMatch.groups?.correlationId
  }
  const hoMatch = comparison.incomingMessage.match(/<br7:UniqueID>(?<correlationId>[^<]*)<\/br7:UniqueID>/)
  if (hoMatch) {
    return hoMatch.groups?.correlationId
  }
}

const comparePhase1 = async (
  comparison: OldPhase1Comparison | Phase1Comparison,
  debug = false,
  { defaultStandingDataVersion }: CompareOptions = {}
): Promise<ComparisonResultDetail> => {
  const { incomingMessage, annotatedHearingOutcome, triggers, standingDataVersion } = comparison
  const correlationId = getCorrelationId(comparison)
  const normalisedAho = annotatedHearingOutcome.replace(/ WeedFlag="[^"]*"/g, "")

  const dataVersion = standingDataVersion || defaultStandingDataVersion || "latest"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).dataVersion = dataVersion
  if (debug) {
    logger.debug(`Using version ${dataVersion} of standing data`)
  }

  const sortedTriggers = sortTriggers(triggers)
  const exceptions = extractExceptionsFromAho(normalisedAho)
  const sortedExceptions = sortExceptions(exceptions)

  const pncResponse = generateMockPncQueryResultFromAho(normalisedAho)
  const pncQueryTime = getPncQueryTimeFromAho(normalisedAho)
  const pncGateway = new MockPncGateway(pncResponse, pncQueryTime)
  const auditLogger = new CoreAuditLogger()

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }

    const [inputAho] = parseIncomingMessage(incomingMessage)
    const coreResult = await phase1Handler(inputAho, pncGateway, auditLogger)
    if (coreResult.resultType === Phase1ResultType.failure) {
      throw Error("Failed to process")
    }

    const sortedCoreExceptions = sortExceptions(coreResult.hearingOutcome.Exceptions ?? [])
    const sortedCoreTriggers = sortTriggers(coreResult.triggers)

    const ahoXml = convertAhoToXml(coreResult.hearingOutcome)
    const parsedAho = parseAhoXml(normalisedAho)
    if (parsedAho instanceof Error) {
      throw parsedAho
    }

    if (
      process.env.USE_NEW_MATCHER !== "false" &&
      isIntentionalMatchingDifference(parsedAho, coreResult.hearingOutcome, inputAho)
    ) {
      return {
        triggersMatch: true,
        exceptionsMatch: true,
        xmlOutputMatches: true,
        xmlParsingMatches: true,
        intentionalDifference: true
      }
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
      xmlOutputDiff: xmlOutputDiff(ahoXml, normalisedAho),
      xmlParsingDiff: xmlOutputDiff(generatedXml, normalisedAho)
    }

    const ignoreNewMatcherXmlDifferences =
      process.env.USE_NEW_MATCHER !== "false" &&
      sortedCoreExceptions.some((e) => matchingExceptions.includes(e.code)) &&
      sortedCoreExceptions.every(
        (e) => !matchingExceptions.includes(e.code) || exceptions.map((ex) => ex.code).includes(e.code)
      )

    const ignoreNewMatcherTrigger18Differences =
      process.env.USE_NEW_MATCHER !== "false" &&
      triggers.some((t) => t.code === TriggerCode.TRPR0018) &&
      exceptions.some((e) => matchingExceptions.includes(e.code))

    let xmlOutputMatchesValue = xmlOutputMatches(ahoXml, normalisedAho)
    if (isIgnored) {
      xmlOutputMatchesValue = !hasOffences(coreResult.hearingOutcome)
    }
    if (ignoreNewMatcherXmlDifferences) {
      xmlOutputMatchesValue = true
    }

    return {
      triggersMatch: ignoreNewMatcherTrigger18Differences ? true : isEqual(sortedCoreTriggers, sortedTriggers),
      exceptionsMatch: ignoreNewMatcherXmlDifferences ? true : isEqual(sortedCoreExceptions, sortedExceptions),
      xmlOutputMatches: xmlOutputMatchesValue,
      xmlParsingMatches: isIgnored ? true : xmlOutputMatches(generatedXml, normalisedAho),
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

export default comparePhase1
