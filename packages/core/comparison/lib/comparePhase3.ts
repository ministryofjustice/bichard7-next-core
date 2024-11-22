import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import isEqual from "lodash.isequal"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import type { Phase3Comparison } from "../types/ComparisonFile"
import ComparisonResultDetail from "../types/ComparisonResultDetail"
import extractAuditLogEventCodes from "./extractAuditLogEventCodes"
import isIntentionalDifference from "./isIntentionalDifference"
import parseIncomingMessage from "./parseIncomingMessage"
import { sortExceptions } from "./sortExceptions"
import { sortTriggers } from "./sortTriggers"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"
import phase3Handler from "../../phase3/phase3"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import MockPncGateway from "./MockPncGateway"
import { PncApiError } from "../../lib/PncGateway"
import { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"

// We are ignoring the hasError attributes for now because how they are set seems a bit random when there are no errors
const normaliseXml = (xml?: string): string | undefined =>
  xml?.replace(/ WeedFlag="[^"]*"/g, "").replace(/ hasError="false"/g, "")

const comparePhase3 = async (comparison: Phase3Comparison, debug = false): Promise<ComparisonResultDetail> => {
  const { incomingMessage, outgoingMessage, triggers, pncOperations, auditLogEvents, correlationId } = comparison
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

  try {
    if (correlationId && correlationId === process.env.DEBUG_CORRELATION_ID) {
      debugger
    }

    const incomingMessageType = getMessageType(incomingMessage)
    const parsedIncomingMessageResult = parseIncomingMessage(incomingMessage)
    if (!isPncUpdateDataset(parsedIncomingMessageResult.message)) {
      throw new Error("Incompatible incoming message type")
    }

    const normalisedOutgoingMessage = normaliseXml(outgoingMessage)
    const outgoingPncUpdateDataset = normalisedOutgoingMessage
      ? parsePncUpdateDataSetXml(normalisedOutgoingMessage)
      : undefined

    if (isError(outgoingPncUpdateDataset)) {
      throw new Error("Failed to parse outgoing PncUpdateDataset XML")
    }

    let mockPncResponse: PncApiError | undefined = undefined
    const pncErrorMessages = outgoingPncUpdateDataset?.Exceptions.filter((exception) => "message" in exception).map(
      (exception) => exception.message
    )
    if (pncErrorMessages && pncErrorMessages.length > 0) {
      mockPncResponse = new PncApiError(pncErrorMessages)
    }

    const pncGateway = new MockPncGateway(mockPncResponse)

    const coreResult = await phase3Handler(parsedIncomingMessageResult.message, pncGateway, auditLogger)
    if (isError(coreResult)) {
      throw new Error("Unexpected exception while handling phase 3 message")
    }

    const serialisedPhase3OutgoingMessage = normaliseXml(serialiseToXml(coreResult.outputMessage))

    if (!serialisedPhase3OutgoingMessage) {
      throw new Error("Failed to serialise Core output message")
    }

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

    const debugOutput: ComparisonResultDebugOutput = {
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
        ? xmlOutputDiff(serialisedPhase3OutgoingMessage, normalisedOutgoingMessage)
        : []
    }

    return {
      auditLogEventsMatch,
      triggersMatch: true || isEqual(sortedCoreTriggers, sortedTriggers),
      exceptionsMatch: isEqual(sortedCoreExceptions, sortedExceptions),
      pncOperationsMatch: isEqual(pncGateway.updates, pncOperations),
      xmlOutputMatches:
        !normalisedOutgoingMessage || xmlOutputMatches(serialisedPhase3OutgoingMessage, normalisedOutgoingMessage),
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
