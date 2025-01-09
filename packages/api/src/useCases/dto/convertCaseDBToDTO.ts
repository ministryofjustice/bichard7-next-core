import type { CaseDto, CasePartialDTO, RawCaseData } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import { hasAccessToExceptions } from "@moj-bichard7/common/utils/userPermissions"

import {
  errorStatusFromCaseDB,
  resolutionStatusCodeByText,
  triggerStatusFromCaseDB
} from "./resolutionStatusFromCaseDB"

export const convertCaseDBToCaseDTO = (caseDb: RawCaseData, user: User): CaseDto => {
  // TODO: Parse Hearing outcome for AHO and UpdatedHO
  return {
    ...convertCaseDBToCasePartialDTO(caseDb, user),
    aho: caseDb.annotated_msg,
    courtCode: caseDb.court_code,
    courtReference: caseDb.court_reference,
    orgForPoliceFilter: caseDb.org_for_police_filter,
    phase: caseDb.phase,
    updatedHearingOutcome: caseDb.updated_msg
  } satisfies CaseDto
}

export const convertCaseDBToCasePartialDTO = (caseDb: RawCaseData, user: User): CasePartialDTO => {
  // TODO: Load errorLockedBy user to generate the errorLockedByUserFullName
  // TODO: Load triggerLockedBy user to generate the triggerLockedByUserFullName
  return {
    asn: caseDb.asn,
    canUserEditExceptions:
      caseDb.error_locked_by_id === user?.username &&
      hasAccessToExceptions(user) &&
      caseDb.error_status === resolutionStatusCodeByText("Unresolved"),
    courtDate: caseDb.court_date,
    courtName: caseDb.court_name,
    defendantName: caseDb.defendant_name,
    errorId: caseDb.error_id,
    errorLockedByUserFullName: undefined,
    errorLockedByUsername: caseDb.error_locked_by_id,
    errorReport: caseDb.error_report,
    errorStatus: errorStatusFromCaseDB(caseDb),
    isUrgent: caseDb.is_urgent,
    ptiurn: caseDb.ptiurn,
    resolutionTimestamp: caseDb.resolution_ts,
    triggerCount: caseDb.trigger_count,
    triggerLockedByUserFullName: undefined,
    triggerLockedByUsername: caseDb.trigger_locked_by_id,
    triggerStatus: triggerStatusFromCaseDB(caseDb)
  } satisfies CasePartialDTO
}
