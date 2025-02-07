import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { diffJson } from "diff"
import isEqual from "lodash.isequal"

import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { Phase3Comparison } from "../types/ComparisonFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { ComparisonResultDebugOutput } from "../types/ComparisonResultDetail"

import CoreAuditLogger from "../../lib/auditLog/CoreAuditLogger"
import { parsePncUpdateDataSetXml } from "../../lib/parse/parsePncUpdateDataSetXml"
import { PncApiError } from "../../lib/pnc/PncGateway"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import getMessageType from "../../phase1/lib/getMessageType"
import { isPncLockError } from "../../phase3/exceptions/generatePncUpdateExceptionFromMessage"
import { MAXIMUM_PNC_LOCK_ERROR_RETRIES } from "../../phase3/lib/updatePnc"
import phase3Handler from "../../phase3/phase3"
import getPncOperationsFromPncUpdateDataset from "../../phase3/tests/helpers/getPncOperationsFromPncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import extractAuditLogEventCodes from "./extractAuditLogEventCodes"
import MockPncGateway from "./MockPncGateway"
import parseIncomingMessage from "./parseIncomingMessage"
import { sortExceptions } from "./sortExceptions"
import { sortTriggers } from "./sortTriggers"
import { xmlOutputDiff, xmlOutputMatches } from "./xmlOutputComparison"

const excludeEventForBichard = (eventCode: string) =>
  ![EventCode.HearingOutcomeReceivedPhase3].includes(eventCode as EventCode)

const excludeEventForCore = (eventCode: string) =>
  ![EventCode.ExceptionsGenerated, EventCode.PncUpdated, EventCode.TriggersGenerated].includes(eventCode as EventCode)

// We are ignoring the hasError attributes for now because how they are set seems a bit random when there are no errors
const normaliseXml = (xml?: string): string | undefined => {
  const normalisedXml = xml
    ?.replace(/ WeedFlag="[^"]*"/g, "")
    .replace(/ hasError="false"/g, "")
    .replace(/ Error="HO200200"/g, "")

  if (normalisedXml && /HO200101|HO200104/.test(normalisedXml)) {
    return normalisedXml
      .replace(/ hasError="true"/g, "")
      .replace(/<br7:HasError>true<\/br7:HasError>/g, "<br7:HasError>false</br7:HasError>")
  }

  return normalisedXml
}

const normalisePncOperations = (operations: PncUpdateRequest[]) => {
  for (const operation of operations) {
    if (operation.request) {
      for (const value of Object.values(operation.request)) {
        if (Array.isArray(value)) {
          for (const item of value) {
            for (const [subfield, subvalue] of Object.entries(item)) {
              if (subvalue === null) {
                delete (item as unknown as Record<string, unknown>)[subfield]
              }
            }
          }
        }
      }
    }
  }
}

const isValidDisposalTextDifference = (
  corePncOperations: PncUpdateRequest[],
  legacyPncOperations: PncUpdateRequest[],
  offences: Offence[]
) => {
  const onlyDifferenceIsDisposalText = diffJson(corePncOperations, legacyPncOperations)
    .filter((change) => change.added || change.removed)
    .every((change) => change.value.includes("disposalText"))

  const disposalTextIsExclusion = diffJson(corePncOperations, legacyPncOperations)
    .filter((change) => change.removed)
    .every((change) => change.value.includes("EXCLUDED FROM"))

  const disposalTextIsMultiline = offences.some((offence) =>
    offence.Result.some((result) => !!result.ResultVariableText?.includes("\n"))
  )

  return onlyDifferenceIsDisposalText && disposalTextIsExclusion && disposalTextIsMultiline
}

const comparePhase3 = async (comparison: Phase3Comparison, debug = false): Promise<ComparisonResultDetail> => {
  const { incomingMessage, outgoingMessage, triggers, pncOperations, auditLogEvents, correlationId } = comparison
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

  const outgoingMessageMissing = !outgoingMessage

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

    const ignorePncOperationComparison =
      outgoingMessageMissing && parsedIncomingMessageResult.message?.PncOperations.length !== pncOperations.length

    const pncExceptions = outgoingPncUpdateDataset?.Exceptions.filter((exception) => "message" in exception) ?? []

    const mockPncResponses: (PncApiError | undefined)[] = []

    if (!outgoingMessageMissing && outgoingPncUpdateDataset) {
      const beforeOperations = getPncOperationsFromPncUpdateDataset(parsedIncomingMessageResult.message)
      const beforeUnattemptedOperations = beforeOperations.filter((operation) => operation.status !== "Completed")
      const afterOperations = getPncOperationsFromPncUpdateDataset(outgoingPncUpdateDataset)
      const afterUnattemptedOperations = afterOperations.filter((operation) => operation.status === "NotAttempted")
      const afterFailedOperations = afterOperations.filter((operation) => operation.status === "Failed")

      const completedOperationCount =
        beforeUnattemptedOperations.length - afterUnattemptedOperations.length - afterFailedOperations.length

      mockPncResponses.push(...Array.from({ length: completedOperationCount }, () => undefined))

      if (pncExceptions.length > 0) {
        const pncApiError = new PncApiError(pncExceptions.map((exception) => exception.message))

        mockPncResponses.push(pncApiError)

        if (pncExceptions?.some(isPncLockError)) {
          mockPncResponses.push(...Array.from({ length: MAXIMUM_PNC_LOCK_ERROR_RETRIES - 1 }, () => pncApiError))
        }
      }
    }

    const pncGateway = new MockPncGateway(mockPncResponses)

    const coreResult = await phase3Handler(parsedIncomingMessageResult.message, pncGateway, auditLogger)
    if (isError(coreResult)) {
      throw new Error("Unexpected exception while handling phase 3 message")
    }

    normalisePncOperations(pncOperations)
    normalisePncOperations(pncGateway.updates)

    const serialisedPhase3OutgoingMessage = normaliseXml(serialiseToXml(coreResult.outputMessage))

    if (!serialisedPhase3OutgoingMessage) {
      throw new Error("Failed to serialise Core output message")
    }

    const pncOperationsMatch = isEqual(
      pncExceptions && pncExceptions.length > 0
        ? pncGateway.updates.slice(0, pncExceptions?.some(isPncLockError) ? -MAXIMUM_PNC_LOCK_ERROR_RETRIES : -1)
        : pncGateway.updates,
      pncOperations
    )

    const sortedCoreTriggers = sortTriggers(coreResult.triggers)
    const sortedTriggers = sortTriggers(triggers ?? [])
    const triggersMatch = isEqual(sortedCoreTriggers, sortedTriggers)

    const isIntentionalDifference =
      (!pncOperationsMatch || !triggersMatch) &&
      isValidDisposalTextDifference(
        pncGateway.updates,
        pncOperations,
        parsedIncomingMessageResult.message.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
      )

    if (isIntentionalDifference) {
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

    const coreAuditLogEvents = coreResult.auditLogEvents.map((e) => e.eventCode).filter(excludeEventForCore)
    const bichardAuditLogEvents = extractAuditLogEventCodes(auditLogEvents).filter(excludeEventForBichard)
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
      triggersMatch: outgoingMessageMissing || triggersMatch,
      exceptionsMatch: outgoingMessageMissing || isEqual(sortedCoreExceptions, sortedExceptions),
      pncOperationsMatch: ignorePncOperationComparison || pncOperationsMatch,
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
