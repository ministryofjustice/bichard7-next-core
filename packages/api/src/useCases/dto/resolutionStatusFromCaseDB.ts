import type { Case } from "@moj-bichard7/common/types/Case"

export type ResolutionStatus = "Resolved" | "Submitted" | "Unresolved"

export const resolutionStatusByCode: Record<number, ResolutionStatus> = {
  1: "Unresolved",
  2: "Resolved",
  3: "Submitted"
}

export const errorStatusFromCaseDB = (caseDB: Case): null | ResolutionStatus =>
  caseDB.error_status ? resolutionStatusByCode[caseDB.error_status] : null

export const triggerStatusFromCaseDB = (caseDB: Case): null | ResolutionStatus =>
  caseDB.trigger_status ? resolutionStatusByCode[caseDB.trigger_status] : null

export const resolutionStatusCodeByText = (text: string): number | undefined =>
  Object.keys(resolutionStatusByCode)
    .map((num) => Number(num))
    .find((code) => resolutionStatusByCode[code] === text)
