import type { CaseDB, CaseDTO, CasePartialDTO } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import { hasAccessToExceptions } from "@moj-bichard7/common/utils/userPermissions"

import {
  errorStatusFromCaseDB,
  resolutionStatusCodeByText,
  triggerStatusFromCaseDB
} from "./resolutionStatusFromCaseDB"

export const convertCaseDBToCaseDTO = (caseDB: CaseDB, user: User): CaseDTO => {
  // TODO: Parse Hearing outcome for AHO and UpdatedHO
  return {
    ...convertCaseDBToCasePartialDTO(caseDB, user),
    aho: caseDB.annotated_msg,
    courtCode: caseDB.court_code,
    courtReference: caseDB.court_reference,
    orgForPoliceFilter: caseDB.org_for_police_filter,
    phase: caseDB.phase,
    updatedHearingOutcome: caseDB.updated_msg
  } satisfies CaseDTO
}

export const convertCaseDBToCasePartialDTO = (caseDB: CaseDB, user: User): CasePartialDTO => {
  // TODO: Load errorLockedBy user to generate the errorLockedByUserFullName
  // TODO: Load triggerLockedBy user to generate the triggerLockedByUserFullName
  return {
    asn: caseDB.asn,
    canUserEditExceptions:
      caseDB.error_locked_by_id === user?.username &&
      hasAccessToExceptions(user) &&
      caseDB.error_status === resolutionStatusCodeByText("Unresolved"),
    courtDate: caseDB.court_date,
    courtName: caseDB.court_name,
    defendantName: caseDB.defendant_name,
    errorId: caseDB.error_id,
    errorLockedByUserFullName: undefined,
    errorLockedByUsername: caseDB.error_locked_by_id,
    errorReport: caseDB.error_report,
    errorStatus: errorStatusFromCaseDB(caseDB),
    isUrgent: caseDB.is_urgent,
    ptiurn: caseDB.ptiurn,
    resolutionTimestamp: caseDB.resolution_ts,
    triggerCount: caseDB.trigger_count,
    triggerLockedByUserFullName: undefined,
    triggerLockedByUsername: caseDB.trigger_locked_by_id,
    triggerStatus: triggerStatusFromCaseDB(caseDB)
  } satisfies CasePartialDTO
}
