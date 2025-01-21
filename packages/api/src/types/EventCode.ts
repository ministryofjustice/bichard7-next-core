enum EventCode {
  AllTriggersResolved = "triggers.all-resolved",
  ErrorRecordArchived = "error-record.archived",
  ExceptionsGenerated = "exceptions.generated",
  ExceptionsResolved = "exceptions.resolved",
  HearingOutcomeDetails = "hearing-outcome.details",
  IgnoredAncillary = "hearing-outcome.ignored.ancillary",
  IgnoredAppeal = "hearing-outcome.ignored.appeal",
  IgnoredDisabled = "hearing-outcome.ignored.court-disabled",
  IgnoredNonrecordable = "hearing-outcome.ignored.nonrecordable",
  IgnoredNoOffences = "hearing-outcome.ignored.no-offences",
  IgnoredReopened = "hearing-outcome.ignored.reopened",
  MessageRejected = "message-rejected",
  PncResponseNotReceived = "pnc.response-not-received",
  PncResponseReceived = "pnc.response-received",
  PncUpdated = "pnc.updated",
  ReceivedIncomingHearingOutcome = "hearing-outcome.received-incoming",
  RetryingMessage = "hearing-outcome-retrying",
  Sanitised = "sanitised",
  TriggersGenerated = "triggers.generated",
  TriggersResolved = "triggers.resolved"
}

export default EventCode
