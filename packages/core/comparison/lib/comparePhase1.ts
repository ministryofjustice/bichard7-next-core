import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import logger from "@moj-bichard7/common/utils/logger"
import isEqual from "lodash.isequal"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../../types/TriggerCode"
import { extractExceptionsFromXml, parseAhoXml } from "../../phase1/parse/parseAhoXml"
import parseIncomingMessage from "./parseIncomingMessage"
import phase1Handler from "../../phase1/phase1"
import serialiseToXml from "../../phase1/serialise/ahoXml/serialiseToXml"
import type { OldPhase1Comparison, Phase1Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"
import MockPncGateway from "./MockPncGateway"
import generateMockPncQueryResultFromAho from "./generateMockPncQueryResultFromAho"
import getPncQueryTimeFromAho from "./getPncQueryTimeFromAho"
import isIntentionalDifference from "./isIntentionalDifference"
import { matchingExceptions } from "./summariseMatching"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"
import { sortTriggers } from "./sortTriggers"
import { sortExceptions } from "./sortExceptions"

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
  const exceptions = extractExceptionsFromXml(normalisedAho)
  const sortedExceptions = sortExceptions(exceptions)

  const pncResponse = generateMockPncQueryResultFromAho(normalisedAho)
  const pncQueryTime = getPncQueryTimeFromAho(normalisedAho)
  const pncGateway = new MockPncGateway(pncResponse, pncQueryTime)
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }

    const { message: inputAho, type } = parseIncomingMessage(incomingMessage)
    if (type === "PncUpdateDataset") {
      throw new Error("Received invalid incoming message")
    }

    const coreResult = await phase1Handler(inputAho, pncGateway, auditLogger)

    const sortedCoreExceptions = sortExceptions(coreResult.hearingOutcome.Exceptions ?? [])
    const sortedCoreTriggers = sortTriggers(coreResult.triggers)

    const ahoXml = serialiseToXml(coreResult.hearingOutcome as AnnotatedHearingOutcome)
    const parsedAho = parseAhoXml(normalisedAho)
    if (parsedAho instanceof Error) {
      throw parsedAho
    }

    const { message: originalInputAho, type: originalType } = parseIncomingMessage(incomingMessage)
    if (originalType === "PncUpdateDataset") {
      throw new Error("Received invalid incoming message")
    }

    if (isIntentionalDifference(parsedAho, coreResult.hearingOutcome as AnnotatedHearingOutcome, originalInputAho)) {
      return {
        triggersMatch: true,
        exceptionsMatch: true,
        xmlOutputMatches: true,
        xmlParsingMatches: true,
        intentionalDifference: true
      }
    }

    const isIgnored = !hasOffences(parsedAho)
    const generatedXml = serialiseToXml(parsedAho)

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
      sortedCoreExceptions.some((e) => matchingExceptions.includes(e.code)) &&
      sortedCoreExceptions.every(
        (e) => !matchingExceptions.includes(e.code) || exceptions.map((ex) => ex.code).includes(e.code)
      )

    const ignoreNewMatcherTrigger18Differences =
      triggers.some((t) => t.code === TriggerCode.TRPR0018) &&
      exceptions.some((e) => matchingExceptions.includes(e.code))

    let xmlOutputMatchesValue = xmlOutputMatches(ahoXml, normalisedAho)
    if (isIgnored) {
      xmlOutputMatchesValue = !hasOffences(coreResult.hearingOutcome as AnnotatedHearingOutcome)
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
