import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import isEqual from "lodash.isequal"
import orderBy from "lodash.orderby"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
// import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import parseIncomingMessage from "./parseIncomingMessage"
import type Exception from "../../phase1/types/Exception"
import type { Trigger } from "../../phase1/types/Trigger"
import type { NewComparison, OldPhase1Comparison, Phase2Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"
import serialiseToXml from "../../phase2/serialise/pnc-update-dataset-xml/serialiseToXml"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import { isError } from "@moj-bichard7/common/types/Result"

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])
const sortTriggers = (triggers: Trigger[]): Trigger[] => orderBy(triggers, ["code", "offenceSequenceNumber"])

// type CompareOptions = {
//   defaultStandingDataVersion?: string
// }

// const hasOffences = (aho: AnnotatedHearingOutcome): boolean =>
//   !!(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence?.length > 0)

const getCorrelationId = (comparison: OldPhase1Comparison | NewComparison): string | undefined => {
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

const comparePhase2 = (comparison: Phase2Comparison, debug = false): ComparisonResultDetail => {
  const { incomingMessage, outgoingMessage, triggers } = comparison
  console.log(triggers.length)
  console.log(outgoingMessage.length)
  const correlationId = getCorrelationId(comparison)

  const sortedTriggers = sortTriggers(triggers)
  const exceptions: Exception[] = []
  // const exceptions = extractExceptionsFromAho(normalisedAho)
  const sortedExceptions = sortExceptions(exceptions)

  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
  console.log(auditLogger ? "has audit logger" : "doesnt have audit logger")

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }

    const { message, type } = parseIncomingMessage(incomingMessage)
    console.log(message)
    if (type !== "AnnotatedHearingOutcome") {
      throw new Error(`Received invalid incoming message: ${type}`)
    }
    // const coreResult = phase2(inputAho, auditLogger)
    const pncUpdateDataset = parsePncUpdateDataSetXml(outgoingMessage)
    if(isError(pncUpdateDataset)) {
      throw new Error(`Failed to parse PncUpdateDataset XML`)
    }

    const sortedCoreExceptions: Exception[] = []
    // const sortedCoreExceptions = sortExceptions(
    //   coreResult.outputMessage.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions ?? []
    // )
    const sortedCoreTriggers = sortTriggers([])
    // coreResult.triggers

    // const generatedXml = convertAhoToXml(parsedAho)
    const pncUpdateDatasetXml = serialiseToXml(pncUpdateDataset)

    const debugOutput: ComparisonResultDebugOutput = {
      triggers: {
        coreResult: sortedCoreTriggers,
        comparisonResult: triggers
      },
      exceptions: {
        coreResult: sortedCoreExceptions,
        comparisonResult: exceptions
      },
      xmlParsingDiff: xmlOutputDiff(pncUpdateDatasetXml, outgoingMessage),
      xmlOutputDiff: xmlOutputDiff(pncUpdateDatasetXml, outgoingMessage),
    }

    return {
      triggersMatch: isEqual(sortedCoreTriggers, sortedTriggers),
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      xmlOutputMatches: true, //xmlOutputMatches(ahoXml, normalisedAho),
      xmlParsingMatches: xmlOutputMatches(pncUpdateDatasetXml, outgoingMessage),
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

export default comparePhase2
