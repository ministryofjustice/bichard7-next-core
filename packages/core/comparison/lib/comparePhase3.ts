import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import isEqual from "lodash.isequal"

import type { Phase3Comparison } from "../types/ComparisonFile"
import type { Phase3ComparisonResultDebugOutput, Phase3ComparisonResultDetail } from "../types/ComparisonResultDetail"

import CoreAuditLogger from "../../lib/CoreAuditLogger"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import phase3Handler from "../../phase3/phase3"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import extractAuditLogEventCodes from "./extractAuditLogEventCodes"
import isIntentionalDifference from "./isIntentionalDifference"
import MockPncGateway from "./MockPncGateway"
import parseIncomingMessage from "./parseIncomingMessage"
import { sortExceptions } from "./sortExceptions"
import { sortTriggers } from "./sortTriggers"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"

const comparePhase3 = async (comparison: Phase3Comparison, debug = false): Promise<Phase3ComparisonResultDetail> => {
  const { auditLogEvents, correlationId, incomingMessage, outgoingMessage, pncOperations, triggers } = comparison
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
  const pncGateway = new MockPncGateway(undefined)

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }

    const normalisedOutgoingMessage = outgoingMessage?.replace(/ WeedFlag="[^"]*"/g, "")
    const outgoingPncUpdateDataset = normalisedOutgoingMessage
      ? parsePncUpdateDataSetXml(normalisedOutgoingMessage)
      : undefined

    if (isError(outgoingPncUpdateDataset)) {
      throw new Error("Failed to parse outgoing PncUpdateDataset XML")
    }

    const incomingMessageType = getMessageType(incomingMessage)
    const parsedIncomingMessageResult = parseIncomingMessage(incomingMessage)
    if (!isPncUpdateDataset(parsedIncomingMessageResult.message)) {
      throw new Error("Incompatible incoming message type")
    }

    const coreResult = await phase3Handler(parsedIncomingMessageResult.message, pncGateway, auditLogger)
    if (isError(coreResult)) {
      throw new Error("Unexpected exception while handling phase 3 message")
    }

    const serialisedPhase2OutgoingMessage = serialiseToXml(coreResult.outputMessage, true)

    if (
      outgoingPncUpdateDataset &&
      isIntentionalDifference(
        outgoingPncUpdateDataset,
        coreResult.outputMessage,
        parsedIncomingMessageResult.message,
        3
      )
    ) {
      return {
        auditLogEventsMatch: true,
        exceptionsMatch: true,
        intentionalDifference: true,
        pncOperationsMatch: true,
        triggersMatch: true,
        xmlOutputMatches: true,
        xmlParsingMatches: true
      }
    }

    const sortedExceptions = sortExceptions(outgoingPncUpdateDataset?.Exceptions ?? [])
    const sortedCoreExceptions = sortExceptions(coreResult.outputMessage.Exceptions ?? [])

    const sortedCoreTriggers = sortTriggers(coreResult.triggers)
    const sortedTriggers = sortTriggers(triggers ?? [])

    const coreAuditLogEvents = coreResult.auditLogEvents.map((e) => e.eventCode)
    const bichardAuditLogEvents = extractAuditLogEventCodes(auditLogEvents)
    const auditLogEventsMatch = isEqual(coreAuditLogEvents, bichardAuditLogEvents)

    const debugOutput: Phase3ComparisonResultDebugOutput = {
      auditLogEvents: {
        comparisonResult: bichardAuditLogEvents,
        coreResult: coreAuditLogEvents
      },
      exceptions: {
        comparisonResult: sortedExceptions,
        coreResult: sortedCoreExceptions
      },
      pncOperations: {
        comparisonResult: pncOperations,
        coreResult: pncGateway.updates
      },
      triggers: {
        comparisonResult: sortedTriggers,
        coreResult: sortedCoreTriggers
      },
      xmlOutputDiff: normalisedOutgoingMessage
        ? xmlOutputDiff(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage)
        : [],
      xmlParsingDiff: []
    }

    return {
      auditLogEventsMatch,
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      incomingMessageType: incomingMessageType,
      pncOperationsMatch: isEqual(pncGateway.updates, pncOperations),
      triggersMatch: isEqual(sortedCoreTriggers, sortedTriggers),
      xmlOutputMatches:
        !normalisedOutgoingMessage || xmlOutputMatches(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage),
      xmlParsingMatches: true,
      ...(debug && { debugOutput })
    }
  } catch (e) {
    return {
      auditLogEventsMatch: false,
      error: e,
      exceptionsMatch: false,
      pncOperationsMatch: false,
      triggersMatch: false,
      xmlOutputMatches: false,
      xmlParsingMatches: false
    }
  }
}

export default comparePhase3
