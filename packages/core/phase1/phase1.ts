import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import enrichAho from "./enrichAho"
import addExceptionsToAho from "./exceptions/addExceptionsToAho"
import generateExceptions from "./exceptions/generate"
import addNullElementsForExceptions from "./lib/addNullElementsForExceptions"
import getAuditLogEvent from "./lib/auditLog/getAuditLogEvent"
import getExceptionsGeneratedLog from "./lib/auditLog/getExceptionsGeneratedLog"
import getIncomingMessageLog from "./lib/auditLog/getIncomingMessageLog"
import getTriggersGeneratedLog from "./lib/auditLog/getTriggersGeneratedLog"
import isReopenedOrStatutoryDeclarationCase from "./lib/isReopenedOrStatutoryDeclarationCase"
import generateTriggers from "./triggers/generate"
import type AuditLogger from "./types/AuditLogger"
import type Phase1Result from "./types/Phase1Result"
import { Phase1ResultType } from "./types/Phase1Result"

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
    const { message: failureMessage, stack } = e as Error

    auditLogger.logEvent(
      getAuditLogEvent(
        AuditLogEventOptions.messageRejectedByCoreHandler,
        EventCategory.error,
        AuditLogEventSource.CoreHandler,
        {
          "Exception Message": failureMessage,
          "Exception Stack Trace": stack
        }
      )
    )

    return {
      auditLogEvents: auditLogger.getEvents(),
      resultType: Phase1ResultType.failure,
      failureMessage
    }
  }
}

export default phase1
