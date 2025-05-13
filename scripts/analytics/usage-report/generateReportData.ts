import EventCode from "@moj-bichard7/common/types/EventCode"
import { FullAuditLogEvent, ReportDataResult, eventCodesToDisplay, getDateString, isNewUIEvent } from "./common"

type UpdateReportDataOptions = {
  event: FullAuditLogEvent
  eventCodeKey: string
  numberToAdd: number
}

const editableExceptions = [
  "HO100102",
  "HO100323",
  "HO100200",
  "HO100300",
  "HO100322",
  "HO100206",
  "HO100301",
  "HO100321",
  "H0100329",
  "H0100332"
]

const AUTO_RESUBMISSION_EXCEPTIONS = ["HO100314", "HO100302", "HO100404", "HO100402"]

const eventsPostExceptionsResolved = [
  EventCode.PncUpdated,
  EventCode.IgnoredAlreadyOnPNC,
  EventCode.IgnoredAncillary,
  EventCode.IgnoredAppeal,
  EventCode.IgnoredDisabled,
  EventCode.IgnoredNoOffences,
  EventCode.IgnoredNonrecordable,
  EventCode.IgnoredReopened
]

const currentExceptions: Record<string, string[]> = {}
const currentResubmissionUi: Record<string, "new-ui" | "old-ui"> = {}
const exceptionsResolvedManually = EventCode.ExceptionsResolved
const exceptionsResubmittedEvents = [EventCode.HearingOutcomeResubmittedPhase1, EventCode.HearingOutcomeResubmittedPhase2]

const getDates = (start: Date, end: Date) => {
  let date = new Date(start)
  const dates: string[] = []
  while (date < end) {
    dates.push(getDateString(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}

const getEventCodeKey = (event: FullAuditLogEvent) => (isNewUIEvent(event) ? "new-ui." : "old-ui.") + event.eventCode

const getResolvedExceptions = (event: FullAuditLogEvent) => {
  if (event.eventCode !== EventCode.ExceptionsGenerated) {
    return currentExceptions[event._messageId]
  }

  const previousExceptions = currentExceptions[event._messageId]
  const newExceptions = extractExceptionCodes(event)
  return previousExceptions.filter((previousException) => !newExceptions.includes(previousException))
}

const extractExceptionCodes = (event: FullAuditLogEvent): string[] =>
  Object.keys(event.attributes ?? {})
    .filter((key) => /Error \d{1,2} Details/.test(key))
    .map((key) => event.attributes?.[key]?.toString().split("||")[0]) as string[]

const excludeAutoResubmissionExceptions = (exceptionCode: string): boolean =>
  !AUTO_RESUBMISSION_EXCEPTIONS.includes(exceptionCode)

const filterAutoResubmissionExceptions = (exceptionCode: string): boolean =>
  AUTO_RESUBMISSION_EXCEPTIONS.includes(exceptionCode)

const createUpdateReportDataFunction =
  (forceOwners: Record<string, number>, date: string, month: string) =>
  async (reportData: any, { event, eventCodeKey, numberToAdd }: UpdateReportDataOptions) => {
    reportData.allSummary[eventCodeKey] = (reportData.allSummary[eventCodeKey] || 0) + numberToAdd

    reportData.allDailyData[date] = {
      ...(reportData.allDailyData[date] ?? {}),
      [eventCodeKey]: (reportData.allDailyData[date]?.[eventCodeKey] || 0) + numberToAdd
    }

    reportData.allMonthlyData[month] = {
      ...(reportData.allMonthlyData[month] ?? {}),
      [eventCodeKey]: (reportData.allMonthlyData[month]?.[eventCodeKey] || 0) + numberToAdd
    }

    if (event.eventCode !== EventCode.ExceptionsGenerated) {
      let username = event.user ?? "unknown"
      reportData.allUserData[username] = {
        ...(reportData.allUserData[username] ?? {}),
        [eventCodeKey]: (reportData.allUserData[username]?.[eventCodeKey] || 0) + numberToAdd
      }

      reportData.allDailyUserData[date] = {
        ...(reportData.allDailyUserData[date] ?? {}),
        [username]: {
          ...(reportData.allDailyUserData[date]?.[username] ?? {}),
          [eventCodeKey]: (reportData.allDailyUserData[date]?.[username]?.[eventCodeKey] || 0) + numberToAdd
        }
      }

      reportData.allMonthlyUserData[month] = {
        ...(reportData.allMonthlyUserData[month] ?? {}),
        [username]: {
          ...(reportData.allMonthlyUserData[month]?.[username] ?? {}),
          [eventCodeKey]: (reportData.allMonthlyUserData[month]?.[username]?.[eventCodeKey] || 0) + numberToAdd
        }
      }
    }

    const forceOwner = forceOwners[event._messageId]
    reportData.allMonthlyForceData[month] = {
      ...(reportData.allMonthlyForceData[month] ?? {}),
      [forceOwner!]: {
        ...(reportData.allMonthlyForceData[month]?.[forceOwner!] ?? {}),
        [eventCodeKey]: (reportData.allMonthlyForceData[month]?.[forceOwner!]?.[eventCodeKey] || 0) + numberToAdd
      }
    }
  }

const generateReportData = async (
  events: FullAuditLogEvent[],
  start: Date,
  end: Date,
  forceOwners: Record<string, number>
): Promise<ReportDataResult> => {
  const reportData = {
    allEventCodes: new Set<string>(),
    newUiEventCodes: new Set<string>(),
    usersWithNewUiEvent: new Set<string>(),

    allDailyData: {} as Record<string, Record<string, number>>,
    allMonthlyData: {} as Record<string, Record<string, number>>,
    allDailyUserData: {} as Record<string, Record<string, Record<string, number>>>,
    allMonthlyUserData: {} as Record<string, Record<string, Record<string, number>>>,
    allMonthlyForceData: {} as Record<string, Record<string, Record<string, number>>>,
    allUserData: {} as Record<string, Record<string, number>>,
    allSummary: {} as Record<EventCode, number>,

    newUiDailyData: {} as Record<string, Record<string, number>>,
    newUiMonthlyData: {} as Record<string, Record<string, number>>,
    newUiDailyUserData: {} as Record<string, Record<string, Record<string, number>>>,
    newUiMonthlyUserData: {} as Record<string, Record<string, Record<string, number>>>,
    newUiUserData: {} as Record<string, Record<string, number>>,
    newUiSummary: {} as Record<EventCode, number>
  }

  getDates(start, end).forEach((date: string) => {
    const month = date.substring(0, 7)
    reportData.allDailyData[date] = {}
    reportData.allMonthlyData[month] = {}
    reportData.newUiDailyData[date] = {}
    reportData.newUiMonthlyData[month] = {}
  })

  for (const event of events) {
    if (event.eventSource === "ResubmitFailedPNCMessages") {
      if (currentExceptions[event._messageId]) {
        delete currentExceptions[event._messageId]
      }
      continue
    }

    if (event.eventCode === EventCode.HearingOutcomeDetails) {
      const forceOwner = event.attributes?.["Force Owner"]?.toString()?.substring(0, 2)
      if (forceOwner) {
        forceOwners[event._messageId] = Number(forceOwner)
      }

      continue
    }

    const date = getDateString(event.timestamp)
    const month = date.substring(0, 7)
    const updateReportData = createUpdateReportDataFunction(forceOwners, date, month)

    let eventCodeKey = getEventCodeKey(event)
    let numberToAdd = 1

    if (
      currentExceptions[event._messageId] &&
      currentResubmissionUi[event._messageId] &&
      (event.eventCode === EventCode.ExceptionsGenerated || eventsPostExceptionsResolved.includes(event.eventCode))
    ) {
      const customEventCodeKey = `${currentResubmissionUi[event._messageId]}.Resolved exceptions`
      reportData.allEventCodes.add(customEventCodeKey)
      const resolvedExceptions = getResolvedExceptions(event)

      await updateReportData(reportData, {
        event,
        numberToAdd: resolvedExceptions.length,
        eventCodeKey: customEventCodeKey
      })

      // Editable exceptions
      const resolvedEditableExceptions = resolvedExceptions.filter((exceptionCode) =>
        editableExceptions.includes(exceptionCode)
      )
      if (resolvedEditableExceptions.length > 0) {
        numberToAdd = resolvedEditableExceptions.length
        const customEventCodeKey = `${currentResubmissionUi[event._messageId]}.Resolved editable exceptions`
        reportData.allEventCodes.add(customEventCodeKey)
        await updateReportData(reportData, {
          event,
          numberToAdd,
          eventCodeKey: customEventCodeKey
        })
      }
    }

    if (event.eventCode === EventCode.ExceptionsGenerated) {
      eventCodeKey = ".Total exceptions"
      currentExceptions[event._messageId] = extractExceptionCodes(event)
      const numberOfExceptions = currentExceptions[event._messageId].filter(excludeAutoResubmissionExceptions).length
      numberToAdd = numberOfExceptions
    }

    if (event.eventCode === exceptionsResolvedManually) {
      const autoResubmissionExceptions =
        currentExceptions[event._messageId]?.filter(filterAutoResubmissionExceptions).length || 0

      if (autoResubmissionExceptions > 0) {
        await updateReportData(reportData, {
          event,
          numberToAdd: autoResubmissionExceptions,
          eventCodeKey: ".Total exceptions"
        })
      }
      numberToAdd = currentExceptions[event._messageId]?.length || 0
    }

    if (event.eventCode === EventCode.TriggersGenerated) {
      numberToAdd = Number(event?.attributes?.["Number of Triggers"] || 0)
      eventCodeKey = ".Total triggers"
    }

    if (event.eventCode === EventCode.TriggersResolved) {
      numberToAdd = Number(event?.attributes?.["Number Of Triggers"] || 0)
    }

    if (exceptionsResubmittedEvents.includes(event.eventCode)) {
      const ui = isNewUIEvent(event) ? "new-ui" : "old-ui"
      eventCodeKey = `${ui}.Exceptions resubmitted`
      currentResubmissionUi[event._messageId] = ui
      numberToAdd = currentExceptions[event._messageId]?.length ?? 0
      if (event.user === "System") {
        numberToAdd = 0
      }
    }

    reportData.allEventCodes.add(eventCodeKey)

    await updateReportData(reportData, { event, numberToAdd, eventCodeKey })
  }

  reportData.allEventCodes = new Set(
    Array.from(reportData.allEventCodes).filter((eventCode) =>
      eventCodesToDisplay.some((eventCodeToDisplay) => eventCode.includes(eventCodeToDisplay))
    )
  )

  return {
    allEvents: {
      summary: reportData.allSummary,
      users: reportData.allUserData,
      daily: reportData.allDailyData,
      monthly: reportData.allMonthlyData,
      dailyUsers: reportData.allDailyUserData,
      monthlyUsers: reportData.allMonthlyUserData,
      monthlyForces: reportData.allMonthlyForceData,
      eventCodes: Array.from(reportData.allEventCodes)
    }
  }
}

export default generateReportData
