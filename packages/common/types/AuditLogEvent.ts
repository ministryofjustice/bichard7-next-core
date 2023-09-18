import type { z } from "zod"
import type { auditLogEventSchema } from "../schemas/auditLogEvent"
import EventCode from "./EventCode"

export type AuditLogEvent = z.infer<typeof auditLogEventSchema>
export enum AuditLogEventSource {
  CorePhase1 = "CorePhase1"
}

export const auditLogEventLookup: Record<EventCode, string> = {
  [EventCode.AllTriggersResolved]: "All triggers marked as resolved",
  [EventCode.DuplicateMessage]: "Duplicate message body received",
  [EventCode.ErrorRecordArchived]: "Error record archived",
  [EventCode.ExceptionsGenerated]: "Exceptions generated",
  [EventCode.ExceptionsLocked]: "Exception locked",
  [EventCode.ExceptionsResolved]: "Exception marked as resolved by user",
  [EventCode.ExceptionsUnlocked]: "Exception unlocked",
  [EventCode.HearingOutcomeDetails]: "Hearing outcome details",
  [EventCode.HearingOutcomeReallocated]: "Hearing outcome reallocated by user",
  [EventCode.HearingOutcomeReceivedPhase1]: "Hearing outcome received by phase 1",
  [EventCode.HearingOutcomeReceivedPhase2]: "Hearing outcome received by phase 2",
  [EventCode.HearingOutcomeReceivedPhase3]: "Hearing outcome received by phase 3",
  [EventCode.HearingOutcomeResubmittedPhase1]: "Hearing outcome resubmitted to phase 1",
  [EventCode.HearingOutcomeResubmittedPhase2]: "Hearing outcome resubmitted to phase 2",
  [EventCode.HearingOutcomeSubmittedPhase2]: "Hearing outcome submitted to phase 2",
  [EventCode.HearingOutcomeSubmittedPhase3]: "Hearing outcome submitted to phase 3",
  [EventCode.IgnoredAlreadyOnPNC]: "Results already on PNC",
  [EventCode.IgnoredAncillary]: "Interim hearing with ancillary only court results. PNC not updated",
  [EventCode.IgnoredAppeal]: "Hearing outcome ignored - Appeal result did not amend disposal",
  [EventCode.IgnoredDisabled]: "Hearing outcome ignored - PNC update is not enabled for this court",
  [EventCode.IgnoredNonrecordable]: "Hearing Outcome ignored as no offences are recordable",
  [EventCode.IgnoredNoOffences]: "Hearing Outcome ignored as it contains no offences",
  [EventCode.IgnoredReopened]: "Re-opened / Statutory Declaration case ignored",
  [EventCode.MessageRejected]: "Message Rejected by CoreHandler",
  [EventCode.PncResponseNotReceived]: "PNC Response not received",
  [EventCode.PncResponseReceived]: "PNC Response received",
  [EventCode.PncUpdated]: "PNC Update applied successfully",
  [EventCode.ReceivedIncomingHearingOutcome]: "Incoming hearing outcome received",
  [EventCode.ReceivedResubmittedHearingOutcome]: "Resubmitted hearing outcome received",
  [EventCode.ReportRun]: "Report run",
  [EventCode.RetryingMessage]: "Retrying message",
  [EventCode.Sanitised]: "Message record sanitised",
  [EventCode.TriggersDeleted]: "Triggers deleted",
  [EventCode.TriggersGenerated]: "Triggers generated",
  [EventCode.TriggersLocked]: "Trigger locked",
  [EventCode.TriggersResolved]: "Trigger marked as resolved by user",
  [EventCode.TriggersUnlocked]: "Trigger unlocked"
}
