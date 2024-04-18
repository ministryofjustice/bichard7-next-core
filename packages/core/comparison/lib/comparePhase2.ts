import type { NewComparison, OldPhase1Comparison, Phase2Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"
import serialiseToXml from "../../phase2/serialise/pnc-update-dataset-xml/serialiseToXml"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import { isError } from "@moj-bichard7/common/types/Result"
import getMessageType from "../../phase1/lib/getMessageType"

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
  let serialisedXml: string
  let originalXml: string

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }


    const type = getMessageType(incomingMessage)

    if (type == "AnnotatedHearingOutcome") {
      originalXml = outgoingMessage
      const outgoingPncUpdateDataset = parsePncUpdateDataSetXml(originalXml)
      if (isError(outgoingPncUpdateDataset)) {
        throw new Error("Failed to parse outgoing PncUpdateDataset XML")
      }
      serialisedXml = serialiseToXml(outgoingPncUpdateDataset, true)
      if (isError(serialisedXml)) {
        throw new Error("Failed to serialise parsed outgoing PncUpdateDataset XML")
      }
    } else if (type == "PncUpdateDataset") {
      originalXml = incomingMessage
      const outgoingPncUpdateDataset = parsePncUpdateDataSetXml(originalXml)
      if (isError(outgoingPncUpdateDataset)) {
        throw new Error("Failed to parse outgoing PncUpdateDataset XML")
      }
      serialisedXml = serialiseToXml(outgoingPncUpdateDataset)
      if (isError(serialisedXml)) {
        throw new Error("Failed to serialise parsed incoming PncUpdateDataset XML")
      }
    } else {
      throw new Error(`Received unsupported incoming message: ${type}`)
    }

    const debugOutput: ComparisonResultDebugOutput = {
      triggers: {
        coreResult: triggers,
        comparisonResult: triggers
      },
      exceptions: {
        coreResult: [],
        comparisonResult: []
      },
      xmlParsingDiff: xmlOutputDiff(serialisedXml, originalXml),
      xmlOutputDiff: xmlOutputDiff(serialisedXml, originalXml)
    }

    return {
      triggersMatch: true,
      exceptionsMatch: true,
      xmlOutputMatches: true,
      xmlParsingMatches: xmlOutputMatches(serialisedXml, originalXml),
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
