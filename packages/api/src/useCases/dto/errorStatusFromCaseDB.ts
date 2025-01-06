import type { CaseDB } from "@moj-bichard7/common/types/Case"

export type ResolutionStatus = "Resolved" | "Submitted" | "Unresolved"

export const resolutionStatusByCode: Record<number, ResolutionStatus> = {
  1: "Unresolved",
  2: "Resolved",
  3: "Submitted"
}

const errorStatusFromCaseDB = (caseDB: CaseDB): ResolutionStatus =>
  caseDB.error_status ? resolutionStatusByCode[caseDB.error_status] : resolutionStatusByCode[1]

export default errorStatusFromCaseDB
