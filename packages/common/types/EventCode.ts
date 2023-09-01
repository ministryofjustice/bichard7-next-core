enum EventCode {
  TriggersGenerated = "triggers.generated",
  TriggersResolved = "triggers.resolved",
  AllTriggersResolved = "triggers.all-resolved",
  ExceptionsResolved = "exceptions.resolved",
  PncUpdated = "pnc.updated",
  ReceivedIncomingHearingOutcome = "hearing-outcome.received-incoming",
  IgnoredNonrecordable = "hearing-outcome.ignored.nonrecordable",
  IgnoredNoOffences = "hearing-outcome.ignored.no-offences",
  IgnoredReopened = "hearing-outcome.ignored.reopened",
  IgnoredAncillary = "hearing-outcome.ignored.ancillary",
  IgnoredDisabled = "hearing-outcome.ignored.court-disabled",
  IgnoredAppeal = "hearing-outcome.ignored.appeal",
  MessageRejected = "message-rejected",
  RetryingMessage = "hearing-outcome-retrying",
  ErrorRecordArchived = "error-record.archived",
  ExceptionsGenerated = "exceptions.generated",
  Sanitised = "sanitised",
  HearingOutcomeDetails = "hearing-outcome.details",
  PncResponseReceived = "pnc.response-received",
  PncResponseNotReceived = "pnc.response-not-received",
  DuplicateMessage = "audit-log.duplicate-message"
}

export default EventCode
