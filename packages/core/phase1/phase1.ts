import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import enrichAho from "./enrichAho"
import addExceptionsToAho from "./exceptions/addExceptionsToAho"
import generateExceptions from "./exceptions/generate"
import addNullElementsForExceptions from "./lib/addNullElementsForExceptions"
import generateExceptionLogAttributes from "./lib/auditLog/generateExceptionLogAttributes"
import generateTriggersLogAttributes from "./lib/auditLog/generateTriggersLogAttributes"
import getIncomingMessageLogAttributes from "./lib/auditLog/getIncomingMessageLog"
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
  const correlationId = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length === 0) {
    auditLogger.info(EventCode.IgnoredNoOffences, {
      ASN: hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
    })

    return {
      correlationId,
      hearingOutcome,
      triggers: [],
      auditLogEvents: auditLogger.getEvents(),
      resultType: Phase1ResultType.ignored
    }
  }

  const enrichedHearingOutcome = await enrichAho(hearingOutcome, pncGateway, auditLogger)

  auditLogger.info(
    EventCode.HearingOutcomeDetails,
    getIncomingMessageLogAttributes(enrichedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome)
  )

  if (isError(enrichedHearingOutcome)) {
    throw enrichedHearingOutcome
  }
  const triggers = generateTriggers(enrichedHearingOutcome)

  if (triggers.length > 0) {
    auditLogger.info(
      EventCode.TriggersGenerated,
      generateTriggersLogAttributes(triggers, enrichedHearingOutcome.Exceptions.length > 0)
    )
  }

  const isIgnored = isReopenedOrStatutoryDeclarationCase(enrichedHearingOutcome)
  let resultType: Phase1ResultType
  if (isIgnored) {
    auditLogger.info(EventCode.IgnoredReopened)
    resultType = Phase1ResultType.ignored
  } else {
    const exceptions = generateExceptions(enrichedHearingOutcome)
    exceptions.forEach(({ code, path }) => {
      addExceptionsToAho(enrichedHearingOutcome as AnnotatedHearingOutcome, code, path)
    })

    addNullElementsForExceptions(enrichedHearingOutcome)
    if (enrichedHearingOutcome.Exceptions.length > 0) {
      auditLogger.info(EventCode.ExceptionsGenerated, generateExceptionLogAttributes(enrichedHearingOutcome))
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
}

export default phase1
