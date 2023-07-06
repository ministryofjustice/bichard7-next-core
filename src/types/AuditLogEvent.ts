import type EventCategory from "./EventCategory"
import type KeyValuePair from "./KeyValuePair"

export type AuditLogEvent = {
  attributes?: KeyValuePair<string, unknown>
  category: EventCategory
  eventCode: string
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
  code: string
  type: string
}

export const AuditLogEventOptions = {
  hearingOutcomeReceivedPhase1: {
    code: "hearing-outcome.received-phase-1",
    type: "Hearing outcome received by phase 1"
  },
  hearingOutcomeReceivedPhase2: {
    code: "hearing-outcome.received-phase-2",
    type: "Hearing outcome received by phase 2"
  },
  hearingOutcomeReceivedPhase3: {
    code: "hearing-outcome.received-phase-3",
    type: "Hearing outcome received by phase 3"
  },
  exceptionResolved: {
    code: "exceptions.resolved",
    type: "Exception marked as resolved by user"
  },
  triggerResolved: {
    code: "triggers.resolved",
    type: "Trigger marked as resolved by user"
  },
  allTriggersResolved: {
    code: "triggers.all-resolved",
    type: "All triggers marked as resolved"
  },
  hearingOutcomeReallocated: {
    code: "hearing-outcome.reallocated",
    type: "Hearing outcome reallocated by user"
  },
  resubmittedToPhase1: {
    code: "hearing-outcome.resubmitted-phase-1",
    type: "Hearing outcome resubmitted to phase 1"
  },
  submittedToPhase2: {
    code: "hearing-outcome.submitted-phase-2",
    type: "Hearing outcome submitted to phase 2"
  },
  resubmittedToPhase2: {
    code: "hearing-outcome.resubmitted-phase-2",
    type: "Hearing outcome resubmitted to phase 2"
  },
  submittedToPhase3: {
    code: "hearing-outcome.submitted-phase-3",
    type: "Hearing outcome submitted to phase 3"
  },
  exceptionLocked: {
    code: "exceptions.locked",
    type: "Exception locked"
  },
  exceptionUnlocked: {
    code: "exceptions.unlocked",
    type: "Exception unlocked"
  },
  triggerLocked: {
    code: "triggers.locked",
    type: "Trigger locked"
  },
  triggerUnlocked: {
    code: "triggers.unlocked",
    type: "Trigger unlocked"
  },
  exceptionsGenerated: {
    code: "exceptions.generated",
    type: "Exceptions generated"
  },
  triggerGenerated: {
    code: "triggers.generated",
    type: "Triggers generated"
  },
  triggerDeleted: {
    code: "triggers.deleted",
    type: "Triggers deleted"
  },
  hearingOutcomeIgnoredNoOffences: {
    code: "hearing-outcome.ignored.no-offences",
    type: "Hearing Outcome ignored as it contains no offences"
  },
  hearingOutcomeIgnoredReopened: {
    code: "hearing-outcome.ignored.reopened",
    type: "Re-opened / Statutory Declaration case ignored"
  },
  hearingOutcomeIgnoredCourtDisabled: {
    code: "hearing-outcome.ignored.court-disabled",
    type: "Hearing outcome ignored - PNC update is not enabled for this court"
  },
  hearingOutcomeIgnoredAppeal: {
    code: "hearing-outcome.ignored.appeal",
    type: "Hearing outcome ignored - Appeal result did not amend disposal"
  },
  hearingOutcomeIgnoredNonrecordable: {
    code: "hearing-outcome.ignored.nonrecordable",
    type: "Hearing Outcome ignored as no offences are recordable"
  },
  hearingOutcomeIgnoredAncillary: {
    code: "hearing-outcome.ignored.ancillary",
    type: "Interim hearing with ancillary only court results. PNC not updated"
  },
  hearingOutcomeDetails: {
    code: "hearing-outcome.details",
    type: "Hearing outcome details"
  },
  messageRejectedByCoreHandler: {
    code: "message-rejected",
    type: "Message Rejected by CoreHandler"
  },
  resubmittedHearingOutcomeReceived: {
    code: "hearing-outcome.resubmitted-received",
    type: "Resubmitted hearing outcome received"
  },
  resultsAlreadyOnPNC: {
    code: "hearing-outcome.ignored.results-already-on-pnc",
    type: "Results already on PNC"
  },
  pncUpdated: {
    code: "pnc.updated",
    type: "PNC Update applied successfully"
  },
  reportRun: {
    code: "report-run",
    type: "Report run"
  },
  pncResponseReceived: {
    code: "pnc.response-received",
    type: "PNC Response received"
  },
  pncResponseNotReceived: {
    code: "pnc.response-not-received",
    type: "PNC Response not received"
  }
}
