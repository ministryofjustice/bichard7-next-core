import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import isEqual from "lodash.isequal"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import phase2Handler from "../../phase2/phase2"
import serialiseToXml from "../../phase2/serialise/pnc-update-dataset-xml/serialiseToXml"
import type { NewComparison, OldPhase1Comparison, Phase2Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"
import isIntentionalDifference from "./isIntentionalDifference"
import parseIncomingMessage from "./parseIncomingMessage"
import { sortExceptions } from "./sortExceptions"
import { sortTriggers } from "./sortTriggers"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"

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
  const correlationId = getCorrelationId(comparison)
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
  let serialisedOutgoingMessage: string

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }

    const normalisedOutgoingMessage = outgoingMessage.replace(/ WeedFlag="[^"]*"/g, "")
    const outgoingPncUpdateDataset = parsePncUpdateDataSetXml(normalisedOutgoingMessage)

    if (isError(outgoingPncUpdateDataset)) {
      throw new Error("Failed to parse outgoing PncUpdateDataset XML")
    }

    const incomingMessageType = getMessageType(incomingMessage)

    const allOperationsAreCompleted =
      outgoingPncUpdateDataset.PncOperations.length > 0 &&
      outgoingPncUpdateDataset.PncOperations.every((op) => op.status === "Completed")
    const addFalseHasErrorAttributes = incomingMessageType !== "PncUpdateDataset" || allOperationsAreCompleted
    serialisedOutgoingMessage = serialiseToXml(outgoingPncUpdateDataset, addFalseHasErrorAttributes)
    if (isError(serialisedOutgoingMessage)) {
      throw new Error("Failed to serialise parsed outgoing PncUpdateDataset XML")
    }

    const parsedIncomingMessageResult = parseIncomingMessage(incomingMessage)
    const coreResult = phase2Handler(parsedIncomingMessageResult.message, auditLogger)
    const serialisedPhase2OutgoingMessage = serialiseToXml(coreResult.outputMessage, addFalseHasErrorAttributes)

    if (
      isIntentionalDifference(
        outgoingPncUpdateDataset,
        coreResult.outputMessage,
        parsedIncomingMessageResult.message,
        2
      )
    ) {
      return {
        triggersMatch: true,
        exceptionsMatch: true,
        xmlOutputMatches: true,
        xmlParsingMatches: true,
        intentionalDifference: true
      }
    }

    const sortedExceptions = sortExceptions(outgoingPncUpdateDataset.Exceptions)
    const sortedCoreExceptions = sortExceptions(coreResult.outputMessage.Exceptions ?? [])

    const sortedCoreTriggers = sortTriggers(coreResult.triggers)
    const sortedTriggers = sortTriggers(triggers)

    const debugOutput: ComparisonResultDebugOutput = {
      triggers: {
        coreResult: sortedCoreTriggers,
        comparisonResult: sortedTriggers
      },
      exceptions: {
        coreResult: sortedCoreExceptions,
        comparisonResult: sortedExceptions
      },
      xmlParsingDiff: xmlOutputDiff(serialisedOutgoingMessage, normalisedOutgoingMessage),
      xmlOutputDiff: xmlOutputDiff(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage)
    }

    return {
      triggersMatch: isEqual(sortedCoreTriggers, sortedTriggers),
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      xmlOutputMatches: xmlOutputMatches(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage),
      xmlParsingMatches: xmlOutputMatches(serialisedOutgoingMessage, normalisedOutgoingMessage),
      incomingMessageType: incomingMessageType,
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
