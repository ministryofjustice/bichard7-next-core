import EventCode from "@moj-bichard7/common/types/EventCode"
// import { AuditLogEvent } from "../../../packages/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { FullAuditLogEvent, ReportDataResult, getDateString, isNewUIEvent } from "./common"
import getForceOwner from "./getForceOwner"

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

const extractExceptionCodes = (event: FullAuditLogEvent): string[] =>
  Object.keys(event.attributes ?? {})
    .filter((key) => /Error \d{1,2} Details/.test(key))
    .map((key) => event.attributes?.[key]?.toString().split("||")[0])
    .filter((v) => v && !["HO100314", "HO100302", "HO100404", "HO100402"].includes(v)) as string[]

type UpdateReportDataOptions = {
  event: FullAuditLogEvent
  eventCodeKey: string
  numberToAdd: number
}
const currentExceptions: Record<string, string[]> = {}
const currentResubmissionUi: Record<string, "new-ui" | "old-ui"> = {}
const forceOwners: Record<string, string | undefined> = {}
const createUpdateReportDataFunction =
  (dynamo: DocumentClient, auditLogTableName: string, date: string, month: string) =>
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

    if (!forceOwners[event._messageId] && eventCodeKey.includes(".Total exceptions")) {
      const forceOwnerResult = await getForceOwner(dynamo, auditLogTableName, event._messageId)
      if (isError(forceOwnerResult)) {
        throw forceOwnerResult
      }

      forceOwners[event._messageId] = forceOwnerResult
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

const getResolvedExceptions = (event: FullAuditLogEvent) => {
  if (event.eventCode !== EventCode.ExceptionsGenerated) {
    return currentExceptions[event._messageId]
  }

  const previousExceptions = currentExceptions[event._messageId]
  const newExceptions = extractExceptionCodes(event)
  return previousExceptions.filter((previousException) => !newExceptions.includes(previousException))
}

const generateReportData = async (
  events: FullAuditLogEvent[],
  start: Date,
  end: Date,
  dynamo: DocumentClient,
  auditLogTableName: string
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
    if (event.eventCode === EventCode.HearingOutcomeDetails) {
      forceOwners[event._messageId] = event.attributes?.["Force Owner"]?.toString()?.substring(0, 2)
      continue
    }

    const date = getDateString(event.timestamp)
    const month = date.substring(0, 7)
    const updateReportData = createUpdateReportDataFunction(dynamo, auditLogTableName, date, month)

    let eventCodeKey = getEventCodeKey(event)
    let numberToAdd = 1

    if (
      currentExceptions[event._messageId] &&
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
      const numberOfExceptions = currentExceptions[event._messageId].length
      numberToAdd = numberOfExceptions
    }

    if (
      [EventCode.HearingOutcomeResubmittedPhase1, EventCode.HearingOutcomeResubmittedPhase2].includes(event.eventCode)
    ) {
      currentResubmissionUi[event._messageId] = isNewUIEvent(event) ? "new-ui" : "old-ui"
      numberToAdd = currentExceptions[event._messageId]?.length ?? 0
      if (event.user === "System") {
        numberToAdd = 0
      }
    }

    reportData.allEventCodes.add(eventCodeKey)
    // if (isNewUIEvent(event)) {
    //   reportData.usersWithNewUiEvent.add(username)
    // }

    await updateReportData(reportData, { event, numberToAdd, eventCodeKey })
  }

  // const filterEventForNewUi = (event: FullAuditLogEvent) =>
  //   reportData.usersWithNewUiEvent.has(event.user ?? "Unknown") ||
  //   event.eventCode.includes("pnc.response") ||
  //   event.eventCode.includes("hearing-outcome.ignored") ||
  //   event.eventCode.includes("hearing-outcome.resubmitted-phase")
  // events.filter(filterEventForNewUi).forEach((event) => {
  //   const date = getDateString(event.timestamp)
  //   const month = date.substring(0, 7)
  //   let eventCodeKey = getEventCodeKey(event)
  //   let username = event.user ?? "unknown"

  //   newUiEventCodes.add(eventCodeKey)

  //   newUiSummary[eventCodeKey] = (newUiSummary[eventCodeKey] || 0) + 1

  //   newUiUserData[username] = {
  //     ...(newUiUserData[username] ?? {}),
  //     [eventCodeKey]: (newUiUserData[username]?.[eventCodeKey] || 0) + 1
  //   }

  //   newUiDailyData[date] = {
  //     ...(newUiDailyData[date] ?? {}),
  //     [eventCodeKey]: (newUiDailyData[date]?.[eventCodeKey] || 0) + 1
  //   }

  //   newUiMonthlyData[month] = {
  //     ...(newUiMonthlyData[month] ?? {}),
  //     [eventCodeKey]: (newUiMonthlyData[month]?.[eventCodeKey] || 0) + 1
  //   }

  //   newUiDailyUserData[date] = {
  //     ...(newUiDailyUserData[date] ?? {}),
  //     [username]: {
  //       ...(newUiDailyUserData[date]?.[username] ?? {}),
  //       [eventCodeKey]: (newUiDailyUserData[date]?.[username]?.[eventCodeKey] || 0) + 1
  //     }
  //   }

  //   newUiMonthlyUserData[month] = {
  //     ...(newUiMonthlyUserData[month] ?? {}),
  //     [username]: {
  //       ...(newUiMonthlyUserData[month]?.[username] ?? {}),
  //       [eventCodeKey]: (newUiMonthlyUserData[month]?.[username]?.[eventCodeKey] || 0) + 1
  //     }
  //   }
  // })

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
