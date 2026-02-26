import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
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
  { header: "Defendant Name", key: "defendantName" },
  { header: "Court Name", key: "courtName" },
  { header: "Courtroom", key: "courtRoom" },
  { header: "Hearing Date", key: "hearingDate" },
  { header: "Case Reference", key: "courtReference" },
  { header: "Date/Time Received By CJSE", key: "messageReceivedAt" },
  { header: "Date/Time Resolved", key: "resolvedAt" },
  { header: "Notes", key: "notes" },
  { header: "Resolution Action", key: "resolutionAction" }
] as const

export const bailsColumns: ReportColumn<CaseForBailsReportDto>[] = [
  { header: "Hearing Date", key: "hearingDate" },
  { header: "Court Name", key: "courtName" },
  { header: "Hearing Time", key: "hearingTime" },
  { header: "Defendant Name", key: "defendantName" },
  { header: "Defendant Address", key: "defendantAddress" },
  { header: "Date of Birth", key: "dateOfBirth" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "ASN", key: "asn" },
  { header: "Offence Title(s)", key: "offenceTitles" },
  { header: "Next Court Appearance", key: "nextAppearanceCourt" },
  { header: "Next Court Appearance Date", key: "nextAppearanceDate" },
  { header: "Next Court Appearance Time", key: "nextAppearanceTime" },
  { header: "Date/Time Received by CJSE", key: "receivedDate" },
  { header: "Number of days taken to enter Portal", key: "daysToEnterPortal" },
  { header: "Bail Conditions Imposed", key: "bailConditions" },
  { header: "Case successfully automated to PNC", key: "automatedToPNC" },
  { header: "Trigger Status", key: "triggerStatus" },
  { header: "Trigger Resolved Date", key: "triggerResolvedDate" }
] as const

export const domesticViolenceColumns: ReportColumn<CaseForDomesticViolenceReportDto>[] = [
  { header: "Type", key: "type" },
  { header: "Hearing Date", key: "hearingDate" },
  { header: "Court Name", key: "courtName" },
  { header: "Defendant Name", key: "defendantName" },
  { header: "Date of Birth", key: "dateOfBirth" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "ASN", key: "asn" },
  { header: "Offence Title", key: "offenceTitle" },
  { header: "Outcome", key: "outcome" }
] as const

export const warrantsColumns: ReportColumn<CaseForWarrantsReportDto>[] = [
  { header: "Hearing Date", key: "hearingDate" },
  { header: "Court Name", key: "courtName" },
  { header: "Hearing Time", key: "hearingTime" },
  { header: "Defendant Name", key: "defendantName" },
  { header: "Gender", key: "gender" },
  { header: "Defendant Address", key: "defendantAddress" },
  { header: "Date of Birth", key: "dateOfBirth" },
  { header: "PNCID", key: "pncId" },
  { header: "PTIURN", key: "ptiurn" },
  { header: "ASN", key: "asn" },
  { header: "Offence Title(s)", key: "offencesTitle" },
  { header: "Offence Wording", key: "offencesWording" },
  { header: "Warrant Text", key: "warrantText" },
  { header: "Next Court Appearance", key: "nextCourtAppearance" },
  { header: "Next Court Appearance Date", key: "nextCourtAppearanceDate" },
  { header: "Warrant Type", key: "warrantType" },
  { header: "Bail or No Bail", key: "bailOrNoBail" },
  { header: "Date/Time Received by CJSE", key: "dateTimeReceivedByCJSE" },
  { header: "Number of days taken to enter Portal", key: "numberOfDaysTakenToEnterPortal" },
  { header: "Trigger Status", key: "triggerStatus" },
  { header: "Trigger Resolved Date", key: "triggerResolvedDate" }
] as const
