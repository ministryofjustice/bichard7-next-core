import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import enrichAho from "phase1/enrichAho"
import addExceptionsToAho from "phase1/exceptions/addExceptionsToAho"
import generateExceptions from "phase1/exceptions/generate"
import addNullElementsForExceptions from "phase1/lib/addNullElementsForExceptions"
import getAuditLogEvent from "phase1/lib/auditLog/getAuditLogEvent"
import getExceptionsGeneratedLog from "phase1/lib/auditLog/getExceptionsGeneratedLog"
import getIncomingMessageLog from "phase1/lib/auditLog/getIncomingMessageLog"
import getTriggersGeneratedLog from "phase1/lib/auditLog/getTriggersGeneratedLog"
import isReopenedOrStatutoryDeclarationCase from "phase1/lib/isReopenedOrStatutoryDeclarationCase"
import generateTriggers from "phase1/triggers/generate"
import type AuditLogger from "phase1/types/AuditLogger"
import type Phase1Result from "phase1/types/Phase1Result"
import { Phase1ResultType } from "phase1/types/Phase1Result"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "types/PncGatewayInterface"

const phase1 = async (
  hearingOutcome: AnnotatedHearingOutcome,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<Phase1Result> => {
  try {
    const correlationId = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length === 0) {
      auditLogger.logEvent(
        getAuditLogEvent(
          AuditLogEventOptions.hearingOutcomeIgnoredNoOffences,
          EventCategory.information,
          AuditLogEventSource.CoreHandler,
          {
            ASN: hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
          }
        )
      )

      return {
        correlationId,
        hearingOutcome,
        triggers: [],
        auditLogEvents: auditLogger.getEvents(),
        resultType: Phase1ResultType.ignored
      }
    }

    const enrichedHearingOutcome = await enrichAho(hearingOutcome, pncGateway, auditLogger)

    auditLogger.logEvent(getIncomingMessageLog(enrichedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome))

    if (isError(enrichedHearingOutcome)) {
      throw enrichedHearingOutcome
    }
    const triggers = generateTriggers(enrichedHearingOutcome)
    const exceptions = generateExceptions(enrichedHearingOutcome)

    exceptions.forEach(({ code, path }) => {
      addExceptionsToAho(enrichedHearingOutcome as AnnotatedHearingOutcome, code, path)
    })

    addNullElementsForExceptions(enrichedHearingOutcome)

    const isIgnored = isReopenedOrStatutoryDeclarationCase(enrichedHearingOutcome)
    let resultType: Phase1ResultType
    if (isIgnored) {
      auditLogger.logEvent(
        getAuditLogEvent(
          AuditLogEventOptions.hearingOutcomeIgnoredReopened,
          EventCategory.information,
          AuditLogEventSource.CoreHandler,
          {}
        )
      )
      resultType = Phase1ResultType.ignored
    } else {
      if (enrichedHearingOutcome.Exceptions.length > 0) {
        auditLogger.logEvent(getExceptionsGeneratedLog(enrichedHearingOutcome))
      }
      if (triggers.length > 0) {
        auditLogger.logEvent(getTriggersGeneratedLog(triggers, enrichedHearingOutcome.Exceptions.length > 0))
      }
      resultType = enrichedHearingOutcome.Exceptions.length > 0 ? Phase1ResultType.exceptions : Phase1ResultType.success
    }

    return {
      correlationId,
      triggers,
      hearingOutcome: enrichedHearingOutcome,
      auditLogEvents: auditLogger.getEvents(),
      resultType
    }
  } catch (e) {
    const { message: errorMessage, stack } = e as Error

    auditLogger.logEvent(
      getAuditLogEvent(
        AuditLogEventOptions.messageRejectedByCoreHandler,
        EventCategory.error,
        AuditLogEventSource.CoreHandler,
        {
          "Exception Message": errorMessage,
          "Exception Stack Trace": stack
        }
      )
    )

    return {
      auditLogEvents: auditLogger.getEvents(),
      resultType: Phase1ResultType.failure
    }
  }
}

export default phase1
