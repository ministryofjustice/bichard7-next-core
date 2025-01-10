import type { CaseDto, CasePartialDto, RawCaseData } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { FastifyBaseLogger } from "fastify"

import { hasAccessToExceptions } from "@moj-bichard7/common/utils/userPermissions"

import parseHearingOutcome from "../../services/parseHearingOutcome"
import {
  errorStatusFromCaseDB,
  resolutionStatusCodeByText,
  triggerStatusFromCaseDB
} from "./resolutionStatusFromCaseDB"

export const convertCaseDBToCaseDTO = (caseDB: RawCaseData, user: User, logger: FastifyBaseLogger): CaseDto => {
  const annotatedHearingOutcome = parseHearingOutcome(caseDB.annotated_msg, logger)
  const updatedHearingOutcome = caseDB.updated_msg && parseHearingOutcome(caseDB.updated_msg, logger)

  return {
    ...convertCaseDBToCasePartialDTO(caseDB, user),
    aho: annotatedHearingOutcome as AnnotatedHearingOutcome,
    courtCode: caseDB.court_code,
    courtReference: caseDB.court_reference,
    orgForPoliceFilter: caseDB.org_for_police_filter,
    phase: caseDB.phase,
    updatedHearingOutcome: (updatedHearingOutcome as AnnotatedHearingOutcome) ?? caseDB.updated_msg
  } satisfies CaseDto
}

export const convertCaseDBToCasePartialDTO = (caseDb: RawCaseData, user: User): CasePartialDto => {
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
  } satisfies CasePartialDto
}
