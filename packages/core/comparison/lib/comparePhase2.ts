import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import phase2Handler from "../../phase2/phase2"
import serialiseToXml from "../../phase2/serialise/pnc-update-dataset-xml/serialiseToXml"
import type { NewComparison, OldPhase1Comparison, Phase2Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"
import parseIncomingMessage from "./parseIncomingMessage"
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
    const outgoingPncUpdateDataset = parsePncUpdateDataSetXml(outgoingMessage)
    if (isError(outgoingPncUpdateDataset)) {
      throw new Error("Failed to parse outgoing PncUpdateDataset XML")
    }

    const incomingMessageType = getMessageType(incomingMessage)

    const isPncUpdateDataSet = incomingMessageType === "PncUpdateDataset"
    if (isPncUpdateDataSet) {
      return {
        triggersMatch: false,
        exceptionsMatch: false,
        xmlOutputMatches: false,
        xmlParsingMatches: false,
        skipped: true
      }
    }

    serialisedOutgoingMessage = serialiseToXml(outgoingPncUpdateDataset, !isPncUpdateDataSet)
    if (isError(serialisedOutgoingMessage)) {
      throw new Error("Failed to serialise parsed outgoing PncUpdateDataset XML")
    }

    const parsedIncomingMessageResult = parseIncomingMessage(incomingMessage)
    const coreResult = phase2Handler(parsedIncomingMessageResult.message, auditLogger)
    const serialisedPhase2OutgoingMessage = serialiseToXml(coreResult.outputMessage, !isPncUpdateDataSet)

    const debugOutput: ComparisonResultDebugOutput = {
      triggers: {
        coreResult: triggers,
        comparisonResult: triggers
      },
      exceptions: {
        coreResult: [],
        comparisonResult: []
      },
      xmlParsingDiff: xmlOutputDiff(serialisedOutgoingMessage, outgoingMessage),
      xmlOutputDiff: xmlOutputDiff(serialisedPhase2OutgoingMessage, outgoingMessage)
    }

    return {
      triggersMatch: true,
      exceptionsMatch: true,
      xmlOutputMatches: xmlOutputMatches(serialisedPhase2OutgoingMessage, outgoingMessage),
      xmlParsingMatches: xmlOutputMatches(serialisedOutgoingMessage, outgoingMessage),
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
