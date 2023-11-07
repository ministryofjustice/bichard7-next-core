import { AuditLogEvent } from "../../../packages/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"

type ReportData = {
  summary: Record<EventCode, number>
  users: Record<string, Record<EventCode, number>>
  daily: Record<string, Record<EventCode, number>>
  monthly: Record<string, Record<EventCode, number>>
  dailyUsers: Record<string, Record<string, Record<EventCode, number>>>
  monthlyUsers: Record<string, Record<string, Record<EventCode, number>>>
  eventCodes: string[]
}

type ReportDataResult = {
  allEvents: ReportData
  withNewUiEvents: ReportData,
  usersWithNewUiEvent: string[]
}

const reportEventCodes: EventCode[] = [
  EventCode.AllTriggersResolved,
  EventCode.TriggersLocked,
  EventCode.TriggersUnlocked,
  EventCode.TriggersResolved,
  EventCode.ExceptionsLocked,
  EventCode.ExceptionsUnlocked,
  EventCode.ExceptionsResolved,
  EventCode.HearingOutcomeReallocated
]

const reportEventTitles = {
  [EventCode.AllTriggersResolved]: "Triggers completed",
  [EventCode.TriggersLocked]: "Triggers locked",
  [EventCode.TriggersUnlocked]: "Triggers unlocked",
  [EventCode.TriggersResolved]: "Triggers resolved",
  [EventCode.ExceptionsLocked]: "Exception locked",
  [EventCode.ExceptionsUnlocked]: "Exception unlocked",
  [EventCode.ExceptionsResolved]: "Exception resolved",
  [EventCode.HearingOutcomeReallocated]: "Case reallocated"
} as Record<EventCode, string>

const log = (...params: unknown[]) => {
  const logContent = [new Date().toISOString(), " - ", ...params]
  console.log(...logContent)
}

const getDateString = (date: string | Date) => (typeof date === "object" ? date.toISOString() : date).split("T")[0]

const isNewUIEvent = (event: AuditLogEvent) => event.eventSource === "Bichard New UI"

export { reportEventCodes, reportEventTitles, ReportData, ReportDataResult, getDateString, log, isNewUIEvent }
