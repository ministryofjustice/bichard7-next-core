import EventCode from "@moj-bichard7/common/types/EventCode"
import { AuditLogEvent } from "../../../packages/common/types/AuditLogEvent"

type FullAuditLogEvent = AuditLogEvent & { _messageId: string }

type ReportData = {
  summary: { [key in EventCode]?: number }
  users: Record<string, Record<EventCode, number>>
  daily: Record<string, Record<EventCode, number>>
  monthly: Record<string, Record<EventCode, number>>
  dailyUsers: Record<string, Record<string, Record<EventCode, number>>>
  monthlyUsers: Record<string, Record<string, Record<EventCode, number>>>
  monthlyForces: Record<string, Record<string, Record<EventCode, number>>>
  eventCodes: string[]
}

type ReportDataResult = {
  allEvents: ReportData
}

const reportEventCodes: EventCode[] = [
  EventCode.AllTriggersResolved,
  EventCode.TriggersLocked,
  EventCode.TriggersUnlocked,
  EventCode.TriggersResolved,
  EventCode.TriggersGenerated,
  EventCode.ExceptionsLocked,
  EventCode.ExceptionsUnlocked,
  EventCode.ExceptionsResolved,
  EventCode.ExceptionsGenerated,
  EventCode.HearingOutcomeReallocated,
  EventCode.HearingOutcomeResubmittedPhase1,
  EventCode.HearingOutcomeResubmittedPhase2,
  EventCode.HearingOutcomeDetails,
  EventCode.PncResponseNotReceived,
  EventCode.PncResponseReceived,
  EventCode.IgnoredAlreadyOnPNC,
  EventCode.IgnoredAncillary,
  EventCode.IgnoredAppeal,
  EventCode.IgnoredDisabled,
  EventCode.IgnoredNoOffences,
  EventCode.IgnoredNonrecordable,
  EventCode.IgnoredReopened
]

const eventCodesToDisplay: (EventCode | string)[] = [
  "Total triggers",
  EventCode.TriggersResolved,
  "Total exceptions",
  EventCode.ExceptionsResolved,
  "Resolved exceptions",
  "Exceptions resubmitted"
]

const reportEventTitles = {
  [EventCode.AllTriggersResolved]: "Triggers completed",
  [EventCode.TriggersLocked]: "Triggers locked",
  [EventCode.TriggersUnlocked]: "Triggers unlocked",
  [EventCode.TriggersResolved]: "Triggers resolved",
  [EventCode.ExceptionsLocked]: "Exception locked",
  [EventCode.ExceptionsUnlocked]: "Exception unlocked",
  [EventCode.ExceptionsResolved]: "Exception manually resolved",
  [EventCode.HearingOutcomeReallocated]: "Case reallocated",
  [EventCode.HearingOutcomeResubmittedPhase1]: "Resubmitted to Phase 1",
  [EventCode.HearingOutcomeResubmittedPhase2]: "Resubmitted to Phase 2"
} as Record<EventCode | string, string>

const log = (...params: unknown[]) => {
  const logContent = [new Date().toISOString(), " - ", ...params]
  console.log(...logContent)
}

const getDateString = (date: string | Date) => (typeof date === "object" ? date.toISOString() : date).split("T")[0]

const isNewUIEvent = (event: AuditLogEvent) => event.eventSource === "Bichard New UI"

export {
  eventCodesToDisplay,
  FullAuditLogEvent,
  getDateString,
  isNewUIEvent,
  log,
  ReportData,
  ReportDataResult,
  reportEventCodes,
  reportEventTitles
}
