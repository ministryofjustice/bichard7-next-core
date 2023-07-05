import type EventCategory from "./EventCategory"
import type KeyValuePair from "./KeyValuePair"

type AuditLogEvent = {
  attributes?: KeyValuePair<string, unknown>
  category: EventCategory
  eventCode: string
  eventSource: string
  eventSourceQueueName?: string
  eventType: string
  timestamp: string
  user?: string
}

export default AuditLogEvent

export enum AuditLogEventSource {
  CoreHandler = "CoreHandler",
  EnrichWithPncQuery = "EnrichWithPncQuery"
}

export const AuditLogEventType = {
  HEARING_OUTCOME_RECEIVED_PHASE_1: {
    code: "hearing-outcome.received-phase-1",
    type: "Hearing outcome received by phase 1"
  },
  HEARING_OUTCOME_RECEIVED_PHASE_2: {
    code: "hearing-outcome.received-phase-2",
    type: "Hearing outcome received by phase 2"
  },
  HEARING_OUTCOME_RECEIVED_PHASE_3: {
    code: "hearing-outcome.received-phase-3",
    type: "Hearing outcome received by phase 3"
  },
  EXCEPTION_RESOLVED: {
    code: "exceptions.resolved",
    type: "Exception marked as resolved by user"
  },
  TRIGGER_RESOLVED: {
    code: "triggers.resolved",
    type: "Trigger marked as resolved by user"
  },
  ALL_TRIGGERS_RESOLVED: {
    code: "triggers.all-resolved",
    type: "All triggers marked as resolved"
  },
  HEARING_OUTCOME_REALLOCATED: {
    code: "hearing-outcome.reallocated",
    type: "Hearing outcome reallocated by user"
  },
  RESUBMITTED_TO_PHASE_1: {
    code: "hearing-outcome.resubmitted-phase-1",
    type: "Hearing outcome resubmitted to phase 1"
  },
  SUBMITTED_TO_PHASE_2: {
    code: "hearing-outcome.submitted-phase-2",
    type: "Hearing outcome submitted to phase 2"
  },
  RESUBMITTED_TO_PHASE_2: {
    code: "hearing-outcome.resubmitted-phase-2",
    type: "Hearing outcome resubmitted to phase 2"
  },
  SUBMITTED_TO_PHASE_3: {
    code: "hearing-outcome.submitted-phase-3",
    type: "Hearing outcome submitted to phase 3"
  },
  EXCEPTION_LOCKED: {
    code: "exceptions.locked",
    type: "Exception locked"
  },
  EXCEPTION_UNLOCKED: {
    code: "exceptions.unlocked",
    type: "Exception unlocked"
  },
  TRIGGER_LOCKED: {
    code: "triggers.locked",
    type: "Trigger locked"
  },
  TRIGGER_UNLOCKED: {
    code: "triggers.unlocked",
    type: "Trigger unlocked"
  },
  EXCEPTIONS_GENERATED: {
    code: "exceptions.generated",
    type: "Exceptions generated"
  },
  TRIGGER_GENERATED: {
    code: "triggers.generated",
    type: "Triggers generated"
  },
  TRIGGER_DELETED: {
    code: "triggers.deleted",
    type: "Triggers deleted"
  },
  HEARING_OUTCOME_IGNORED_NO_OFFENCES: {
    code: "hearing-outcome.ignored.no-offences",
    type: "Hearing Outcome ignored as it contains no offences"
  },
  HEARING_OUTCOME_IGNORED_REOPENED: {
    code: "hearing-outcome.ignored.reopened",
    type: "Re-opened / Statutory Declaration case ignored"
  },
  HEARING_OUTCOME_IGNORED_COURT_DISABLED: {
    code: "hearing-outcome.ignored.court-disabled",
    type: "Hearing outcome ignored - PNC update is not enabled for this court"
  },
  HEARING_OUTCOME_IGNORED_APPEAL: {
    code: "hearing-outcome.ignored.appeal",
    type: "Hearing outcome ignored - Appeal result did not amend disposal"
  },
  HEARING_OUTCOME_IGNORED_NONRECORDABLE: {
    code: "hearing-outcome.ignored.nonrecordable",
    type: "Hearing Outcome ignored as no offences are recordable"
  },
  HEARING_OUTCOME_IGNORED_ANCILLARY: {
    code: "hearing-outcome.ignored.ancillary",
    type: "Interim hearing with ancillary only court results. PNC not updated"
  },
  HEARING_OUTCOME_DETAILS: {
    code: "hearing-outcome.details",
    type: "Hearing outcome details"
  },
  MESSAGE_REJECTED_BY_CORE_HANDLER: {
    code: "message-rejected",
    type: "Message Rejected by CoreHandler"
  },
  RESUBMITTED_HEARING_OUTCOME_RECEIVED: {
    code: "hearing-outcome.resubmitted-received",
    type: "Resubmitted hearing outcome received"
  },
  RESULTS_ALREADY_ON_PNC: {
    code: "hearing-outcome.ignored.results-already-on-pnc",
    type: "Results already on PNC"
  },
  PNC_UPDATED: {
    code: "pnc.updated",
    type: "PNC Update applied successfully"
  },
  REPORT_RUN: {
    code: "report-run",
    type: "Report run"
  },
  PNC_RESPONSE_RECEIVED: {
    code: "pnc.response-received",
    type: "PNC Response received"
  },
  PNC_RESPONSE_NOT_RECEIVED: {
    code: "pnc.response-not-received",
    type: "PNC Response not received"
  }
}
