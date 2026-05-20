import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { CodeDetailUserDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type { UserForPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"

export type ReportColumn<TRow> = {
  header: string
  key: Extract<keyof TRow, string>
}

export type BaseReportColumn = {
  header: string
  key: string
}

export const exceptionsColumns: ReportColumn<CaseForExceptionReportDto>[] = [
  { header: "Type", key: "type" },
  { header: "ASN", key: "asn" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "Defendant name", key: "defendantName" },
  { header: "Court name", key: "courtName" },
  { header: "Courtroom", key: "courtRoom" },
  { header: "Hearing date", key: "hearingDate" },
  { header: "Case reference", key: "courtReference" },
  { header: "Date/time received by CJSE", key: "messageReceivedAt" },
  { header: "Date/time resolved", key: "resolvedAt" },
  { header: "Notes", key: "notes" },
  { header: "Resolution action", key: "resolutionAction" }
] as const

export const bailsColumns: ReportColumn<CaseForBailsReportDto>[] = [
  { header: "Hearing date", key: "hearingDate" },
  { header: "Court name", key: "courtName" },
  { header: "Hearing time", key: "hearingTime" },
  { header: "Defendant name", key: "defendantName" },
  { header: "Defendant address", key: "defendantAddress" },
  { header: "Date of birth", key: "dateOfBirth" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "ASN", key: "asn" },
  { header: "Offence title(s)", key: "offenceTitles" },
  { header: "Next court appearance", key: "nextAppearanceCourt" },
  { header: "Next court appearance date", key: "nextAppearanceDate" },
  { header: "Next court appearance time", key: "nextAppearanceTime" },
  { header: "Date/time received by CJSE", key: "receivedDate" },
  { header: "Number of days taken to enter portal", key: "daysToEnterPortal" },
  { header: "Bail conditions imposed", key: "bailConditions" },
  { header: "Case successfully automated to PNC", key: "automatedToPNC" },
  { header: "Trigger status", key: "triggerStatus" },
  { header: "Trigger resolved date", key: "triggerResolvedDate" }
] as const

export const domesticViolenceColumns: ReportColumn<CaseForDomesticViolenceReportDto>[] = [
  { header: "Type", key: "type" },
  { header: "Hearing date", key: "hearingDate" },
  { header: "Court name", key: "courtName" },
  { header: "Defendant name", key: "defendantName" },
  { header: "Date of birth", key: "dateOfBirth" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "ASN", key: "asn" },
  { header: "Offence title", key: "offenceTitle" },
  { header: "Outcome", key: "outcome" }
] as const

export const warrantsColumns: ReportColumn<CaseForWarrantsReportDto>[] = [
  { header: "Hearing date", key: "hearingDate" },
  { header: "Court name", key: "courtName" },
  { header: "Hearing time", key: "hearingTime" },
  { header: "Defendant name", key: "defendantName" },
  { header: "Gender", key: "gender" },
  { header: "Defendant address", key: "defendantAddress" },
  { header: "Date of birth", key: "dateOfBirth" },
  { header: "PNCID", key: "pncId" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "ASN", key: "asn" },
  { header: "Offence title(s)", key: "offencesTitle" },
  { header: "Offence wording", key: "offencesWording" },
  { header: "Warrant text", key: "warrantText" },
  { header: "Next court appearance", key: "nextCourtAppearance" },
  { header: "Next court appearance date", key: "nextCourtAppearanceDate" },
  { header: "Warrant type", key: "warrantType" },
  { header: "Bail or no bail", key: "bailOrNoBail" },
  { header: "Date/time received by CJSE", key: "dateTimeReceivedByCJSE" },
  { header: "Number of days taken to enter portal", key: "numberOfDaysTakenToEnterPortal" },
  { header: "Trigger status", key: "triggerStatus" },
  { header: "Trigger resolved date", key: "triggerResolvedDate" }
] as const

export const userPerformanceSummaryColumns: ReportColumn<UserForPerformanceSummaryDto>[] = [
  { header: "Name", key: "fullName" },
  { header: "Exceptions resolved today", key: "exceptionsResolved" },
  { header: "Triggers resolved today", key: "triggerResolved" },
  { header: "Total exceptions/triggers still locked", key: "totalNumberStillLocked" }
] as const

export const codeDetailUserColumns: Record<string, ReportColumn<CodeDetailUserDto>[]> = {
  exception: [
    { header: "User ID", key: "username" },
    { header: "Number of exceptions resolved today", key: "resolved" },
    { header: "Total number of exceptions still locked", key: "totalLocked" }
  ],
  trigger: [
    { header: "User ID", key: "username" },
    { header: "Number of triggers resolved today", key: "resolved" },
    { header: "Total number of triggers still locked", key: "totalLocked" }
  ]
} as const
