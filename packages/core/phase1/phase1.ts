import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type AuditLogger from "../types/AuditLogger"
import type PoliceGateway from "../types/PoliceGateway"
import type Phase1Result from "./types/Phase1Result"

import generateExceptionLogAttributes from "../lib/auditLog/generateExceptionLogAttributes"
import generateTriggersLogAttributes from "../lib/auditLog/generateTriggersLogAttributes"
import addExceptionsToAho from "../lib/exceptions/addExceptionsToAho"
import generateTriggers from "../lib/triggers/generateTriggers"
import enrichAho from "./enrichAho"
import generateExceptions from "./exceptions/generate"
import getIncomingMessageLogAttributes from "./lib/auditLog/getIncomingMessageLog"
import isReopenedOrStatutoryDeclarationCase from "./lib/isReopenedOrStatutoryDeclarationCase"
import { Phase1ResultType } from "./types/Phase1Result"

const phase1 = async (
  hearingOutcome: AnnotatedHearingOutcome,
  policeGateway: PoliceGateway,
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

  const isIgnored = isReopenedOrStatutoryDeclarationCase(hearingOutcome)

  const enrichedHearingOutcome = await enrichAho(hearingOutcome, policeGateway, auditLogger, isIgnored)

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

  let resultType: Phase1ResultType
  if (isIgnored) {
    auditLogger.info(EventCode.IgnoredReopened)
    resultType = Phase1ResultType.ignored
  } else {
    const exceptions = generateExceptions(enrichedHearingOutcome)
    addExceptionsToAho(enrichedHearingOutcome, exceptions)

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
