import EventCode from "@moj-bichard7/common/types/EventCode"
import { AuditLogEvent } from "../../../packages/common/types/AuditLogEvent"
import { ReportDataResult, getDateString, isNewUIEvent } from "./common"

const getDates = (start: Date, end: Date) => {
  let date = new Date(start)
  const dates: string[] = []
  while (date < end) {
    dates.push(getDateString(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}

const getEventCodeKey = (event: AuditLogEvent) => (isNewUIEvent(event) ? "new-ui." : "old-ui.") + event.eventCode

const generateReportData = (events: AuditLogEvent[], start: Date, end: Date): ReportDataResult => {
  const allEventCodes = new Set<string>()
  const newUiEventCodes = new Set<string>()
  const usersWithNewUiEvent = new Set<string>()

  const allDailyData = {} as Record<string, Record<string, number>>
  const allMonthlyData = {} as Record<string, Record<string, number>>
  const allDailyUserData = {} as Record<string, Record<string, Record<string, number>>>
  const allMonthlyUserData = {} as Record<string, Record<string, Record<string, number>>>
  const allUserData = {} as Record<string, Record<string, number>>
  const allSummary = {} as Record<EventCode, number>

  const newUiDailyData = {} as Record<string, Record<string, number>>
  const newUiMonthlyData = {} as Record<string, Record<string, number>>
  const newUiDailyUserData = {} as Record<string, Record<string, Record<string, number>>>
  const newUiMonthlyUserData = {} as Record<string, Record<string, Record<string, number>>>
  const newUiUserData = {} as Record<string, Record<string, number>>
  const newUiSummary = {} as Record<EventCode, number>

  getDates(start, end).forEach((date: string) => {
    const month = date.substring(0, 7)
    allDailyData[date] = {}
    allMonthlyData[month] = {}
    newUiDailyData[date] = {}
    newUiMonthlyData[month] = {}
  })

  events.forEach((event) => {
    const date = getDateString(event.timestamp)
    const month = date.substring(0, 7)
    const eventCodeKey = getEventCodeKey(event)
    const username = event.user ?? "unknown"
    allEventCodes.add(eventCodeKey)
    if (isNewUIEvent(event)) {
      usersWithNewUiEvent.add(username)
    }

    allSummary[eventCodeKey] = (allSummary[eventCodeKey] || 0) + 1

    allUserData[username] = {
      ...(allUserData[username] ?? {}),
      [eventCodeKey]: (allUserData[username]?.[eventCodeKey] || 0) + 1
    }

    allDailyData[date] = {
      ...(allDailyData[date] ?? {}),
      [eventCodeKey]: (allDailyData[date]?.[eventCodeKey] || 0) + 1
    }

    allMonthlyData[month] = {
      ...(allMonthlyData[month] ?? {}),
      [eventCodeKey]: (allMonthlyData[month]?.[eventCodeKey] || 0) + 1
    }

    allDailyUserData[date] = {
      ...(allDailyUserData[date] ?? {}),
      [username]: {
        ...(allDailyUserData[date]?.[username] ?? {}),
        [eventCodeKey]: (allDailyUserData[date]?.[username]?.[eventCodeKey] || 0) + 1
      }
    }

    allMonthlyUserData[month] = {
      ...(allMonthlyUserData[month] ?? {}),
      [username]: {
        ...(allMonthlyUserData[month]?.[username] ?? {}),
        [eventCodeKey]: (allMonthlyUserData[month]?.[username]?.[eventCodeKey] || 0) + 1
      }
    }
  })

  events
    .filter((event) => usersWithNewUiEvent.has(event.user ?? "Unknown"))
    .forEach((event) => {
      const date = getDateString(event.timestamp)
      const month = date.substring(0, 7)
      const eventCodeKey = getEventCodeKey(event)
      const username = event.user ?? "unknown"
      newUiEventCodes.add(eventCodeKey)

      newUiSummary[eventCodeKey] = (newUiSummary[eventCodeKey] || 0) + 1

      newUiUserData[username] = {
        ...(newUiUserData[username] ?? {}),
        [eventCodeKey]: (newUiUserData[username]?.[eventCodeKey] || 0) + 1
      }

      newUiDailyData[date] = {
        ...(newUiDailyData[date] ?? {}),
        [eventCodeKey]: (newUiDailyData[date]?.[eventCodeKey] || 0) + 1
      }

      newUiMonthlyData[month] = {
        ...(newUiMonthlyData[month] ?? {}),
        [eventCodeKey]: (newUiMonthlyData[month]?.[eventCodeKey] || 0) + 1
      }

      newUiDailyUserData[date] = {
        ...(newUiDailyUserData[date] ?? {}),
        [username]: {
          ...(newUiDailyUserData[date]?.[username] ?? {}),
          [eventCodeKey]: (newUiDailyUserData[date]?.[username]?.[eventCodeKey] || 0) + 1
        }
      }

      newUiMonthlyUserData[month] = {
        ...(newUiMonthlyUserData[month] ?? {}),
        [username]: {
          ...(newUiMonthlyUserData[month]?.[username] ?? {}),
          [eventCodeKey]: (newUiMonthlyUserData[month]?.[username]?.[eventCodeKey] || 0) + 1
        }
      }
    })

  return {
    allEvents: {
      summary: allSummary,
      users: allUserData,
      daily: allDailyData,
      monthly: allMonthlyData,
      dailyUsers: allDailyUserData,
      monthlyUsers: allMonthlyUserData,
      eventCodes: Array.from(allEventCodes)
    },
    withNewUiEvents: {
      summary: newUiSummary,
      users: newUiUserData,
      daily: newUiDailyData,
      monthly: newUiMonthlyData,
      dailyUsers: newUiDailyUserData,
      monthlyUsers: newUiMonthlyUserData,
      eventCodes: Array.from(newUiEventCodes)
    },
    usersWithNewUiEvent: Array.from(usersWithNewUiEvent)
  }
}

export default generateReportData
