import type EventCategory from "../types/EventCategory"
import EventCode from "./EventCode"

export type AuditLogEvent = {
  attributes?: Record<string, unknown>
  category: EventCategory
  eventCode: EventCode
  eventSource: string
  eventSourceQueueName?: string
  eventType: string
  timestamp: string
  user?: string
}

export enum AuditLogEventSource {
  CoreHandler = "CoreHandler",
  EnrichWithPncQuery = "EnrichWithPncQuery"
}

export type AuditLogEventOption = {
  code: EventCode
  type: string
}

export const AuditLogEventOptions: Record<string, AuditLogEventOption> = {
  hearingOutcomeReceivedPhase1: {
    code: EventCode.HearingOutcomeReceivedPhase1,
    type: "Hearing outcome received by phase 1"
  },
  hearingOutcomeReceivedPhase2: {
    code: EventCode.HearingOutcomeReceivedPhase2,
    type: "Hearing outcome received by phase 2"
  },
  hearingOutcomeReceivedPhase3: {
    code: EventCode.HearingOutcomeReceivedPhase3,
    type: "Hearing outcome received by phase 3"
  },
  exceptionResolved: {
    code: EventCode.ExceptionsResolved,
    type: "Exception marked as resolved by user"
  },
  triggerResolved: {
    code: EventCode.TriggersResolved,
    type: "Trigger marked as resolved by user"
  },
  allTriggersResolved: {
    code: EventCode.AllTriggersResolved,
    type: "All triggers marked as resolved"
  },
  hearingOutcomeReallocated: {
    code: EventCode.HearingOutcomeReallocated,
    type: "Hearing outcome reallocated by user"
  },
  resubmittedToPhase1: {
    code: EventCode.HearingOutcomeResubmittedPhase1,
    type: "Hearing outcome resubmitted to phase 1"
  },
  submittedToPhase2: {
    code: EventCode.HearingOutcomeSubmittedPhase2,
    type: "Hearing outcome submitted to phase 2"
  },
  resubmittedToPhase2: {
    code: EventCode.HearingOutcomeResubmittedPhase2,
    type: "Hearing outcome resubmitted to phase 2"
  },
  submittedToPhase3: {
    code: EventCode.HearingOutcomeSubmittedPhase3,
    type: "Hearing outcome submitted to phase 3"
  },
  exceptionLocked: {
    code: EventCode.ExceptionsLocked,
    type: "Exception locked"
  },
  exceptionUnlocked: {
    code: EventCode.ExceptionsUnlocked,
    type: "Exception unlocked"
  },
  triggerLocked: {
    code: EventCode.TriggersLocked,
    type: "Trigger locked"
  },
  triggerUnlocked: {
    code: EventCode.TriggersUnlocked,
    type: "Trigger unlocked"
  },
  exceptionsGenerated: {
    code: EventCode.ExceptionsGenerated,
    type: "Exceptions generated"
  },
  triggerGenerated: {
    code: EventCode.TriggersGenerated,
    type: "Triggers generated"
  },
  triggerDeleted: {
    code: EventCode.TriggersDeleted,
    type: "Triggers deleted"
  },
  hearingOutcomeIgnoredNoOffences: {
    code: EventCode.IgnoredNoOffences,
    type: "Hearing Outcome ignored as it contains no offences"
  },
  hearingOutcomeIgnoredReopened: {
    code: EventCode.IgnoredReopened,
    type: "Re-opened / Statutory Declaration case ignored"
  },
  hearingOutcomeIgnoredCourtDisabled: {
    code: EventCode.IgnoredDisabled,
    type: "Hearing outcome ignored - PNC update is not enabled for this court"
  },
  hearingOutcomeIgnoredAppeal: {
    code: EventCode.IgnoredAppeal,
    type: "Hearing outcome ignored - Appeal result did not amend disposal"
  },
  hearingOutcomeIgnoredNonrecordable: {
    code: EventCode.IgnoredNonrecordable,
    type: "Hearing Outcome ignored as no offences are recordable"
  },
  hearingOutcomeIgnoredAncillary: {
    code: EventCode.IgnoredAncillary,
    type: "Interim hearing with ancillary only court results. PNC not updated"
  },
  hearingOutcomeDetails: {
    code: EventCode.HearingOutcomeDetails,
    type: "Hearing outcome details"
  },
  messageRejectedByCoreHandler: {
    code: EventCode.MessageRejected,
    type: "Message Rejected by CoreHandler"
  },
  resubmittedHearingOutcomeReceived: {
    code: EventCode.ReceivedResubmittedHearingOutcome,
    type: "Resubmitted hearing outcome received"
  },
  resultsAlreadyOnPNC: {
    code: EventCode.IgnoredAlreadyOnPNC,
    type: "Results already on PNC"
  },
  pncUpdated: {
    code: EventCode.PncUpdated,
    type: "PNC Update applied successfully"
  },
  reportRun: {
    code: EventCode.ReportRun,
    type: "Report run"
  },
  pncResponseReceived: {
    code: EventCode.PncResponseReceived,
    type: "PNC Response received"
  },
  pncResponseNotReceived: {
    code: EventCode.PncResponseNotReceived,
    type: "PNC Response not received"
  }
}
