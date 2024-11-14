import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import isEqual from "lodash.isequal"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import type { Phase3Comparison } from "../types/ComparisonFile"
import type { Phase3ComparisonResultDebugOutput, Phase3ComparisonResultDetail } from "../types/ComparisonResultDetail"
import extractAuditLogEventCodes from "./extractAuditLogEventCodes"
import isIntentionalDifference from "./isIntentionalDifference"
import parseIncomingMessage from "./parseIncomingMessage"
import { sortExceptions } from "./sortExceptions"
import { sortTriggers } from "./sortTriggers"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"
import phase3Handler from "../../phase3/phase3"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import MockPncGateway from "./MockPncGateway"

const comparePhase3 = async (comparison: Phase3Comparison, debug = false): Promise<Phase3ComparisonResultDetail> => {
  const { incomingMessage, outgoingMessage, triggers, pncOperations, auditLogEvents, correlationId } = comparison
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
        triggersMatch: true,
        exceptionsMatch: true,
        pncOperationsMatch: true,
        xmlOutputMatches: true,
        xmlParsingMatches: true,
        intentionalDifference: true
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
      triggers: {
        coreResult: sortedCoreTriggers,
        comparisonResult: sortedTriggers
      },
      exceptions: {
        coreResult: sortedCoreExceptions,
        comparisonResult: sortedExceptions
      },
      pncOperations: {
        coreResult: pncGateway.updates,
        comparisonResult: pncOperations
      },
      auditLogEvents: {
        coreResult: coreAuditLogEvents,
        comparisonResult: bichardAuditLogEvents
      },
      xmlParsingDiff: [],
      xmlOutputDiff: normalisedOutgoingMessage
        ? xmlOutputDiff(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage)
        : []
    }

    return {
      auditLogEventsMatch,
      triggersMatch: isEqual(sortedCoreTriggers, sortedTriggers),
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      pncOperationsMatch: isEqual(pncGateway.updates, pncOperations),
      xmlOutputMatches:
        !normalisedOutgoingMessage || xmlOutputMatches(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage),
      xmlParsingMatches: true,
      incomingMessageType: incomingMessageType,
      ...(debug && { debugOutput })
    }
  } catch (e) {
    return {
      auditLogEventsMatch: false,
      triggersMatch: false,
      exceptionsMatch: false,
      pncOperationsMatch: false,
      xmlOutputMatches: false,
      xmlParsingMatches: false,
      error: e
    }
  }
}

export default comparePhase3
