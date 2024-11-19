import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import isEqual from "lodash.isequal"

import type { NewComparison, OldPhase1Comparison, Phase2Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"

import CoreAuditLogger from "../../lib/CoreAuditLogger"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import phase2Handler from "../../phase2/phase2"
import extractAuditLogEventCodes from "./extractAuditLogEventCodes"
import isIntentionalDifference from "./isIntentionalDifference"
import parseIncomingMessage from "./parseIncomingMessage"
import { sortExceptions } from "./sortExceptions"
import { sortTriggers } from "./sortTriggers"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"

const excludeEventForBichard = (eventCode: string) =>
  ![
    EventCode.HearingOutcomeReceivedPhase2,
    EventCode.HearingOutcomeSubmittedPhase3,
    EventCode.ReceivedResubmittedHearingOutcome
  ].includes(eventCode as EventCode)
const excludeEventForCore = (eventCode: string) => eventCode !== EventCode.IgnoredAlreadyOnPNC

const getCorrelationId = (comparison: NewComparison | OldPhase1Comparison): string | undefined => {
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
  const { auditLogEvents, incomingMessage, outgoingMessage, triggers } = comparison
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
        auditLogEventsMatch: true,
        exceptionsMatch: true,
        intentionalDifference: true,
        triggersMatch: true,
        xmlOutputMatches: true,
        xmlParsingMatches: true
      }
    }

    const sortedExceptions = sortExceptions(outgoingPncUpdateDataset.Exceptions)
    const sortedCoreExceptions = sortExceptions(coreResult.outputMessage.Exceptions ?? [])

    const sortedCoreTriggers = sortTriggers(coreResult.triggers)
    const sortedTriggers = sortTriggers(triggers)

    const coreAuditLogEvents = coreResult.auditLogEvents.map((e) => e.eventCode).filter(excludeEventForCore)
    const bichardAuditLogEvents = extractAuditLogEventCodes(auditLogEvents).filter(excludeEventForBichard)
    const auditLogEventsMatch = isEqual(coreAuditLogEvents, bichardAuditLogEvents)

    const debugOutput: ComparisonResultDebugOutput = {
      auditLogEvents: {
        comparisonResult: bichardAuditLogEvents,
        coreResult: coreAuditLogEvents
      },
      exceptions: {
        comparisonResult: sortedExceptions,
        coreResult: sortedCoreExceptions
      },
      triggers: {
        comparisonResult: sortedTriggers,
        coreResult: sortedCoreTriggers
      },
      xmlOutputDiff: xmlOutputDiff(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage),
      xmlParsingDiff: xmlOutputDiff(serialisedOutgoingMessage, normalisedOutgoingMessage)
    }

    return {
      auditLogEventsMatch,
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      incomingMessageType: incomingMessageType,
      triggersMatch: isEqual(sortedCoreTriggers, sortedTriggers),
      xmlOutputMatches: xmlOutputMatches(serialisedPhase2OutgoingMessage, normalisedOutgoingMessage),
      xmlParsingMatches: xmlOutputMatches(serialisedOutgoingMessage, normalisedOutgoingMessage),
      ...(debug && { debugOutput })
    }
  } catch (e) {
    return {
      auditLogEventsMatch: false,
      error: e,
      exceptionsMatch: false,
      triggersMatch: false,
      xmlOutputMatches: false,
      xmlParsingMatches: false
    }
  }
}

export default comparePhase2
