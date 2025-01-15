import type { CaseDto, CasePartialDto, PartialCaseRow } from "@moj-bichard7/common/types/Case"
import type { FullUserRow } from "@moj-bichard7/common/types/User"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { FastifyBaseLogger } from "fastify"

import { hasAccessToExceptions } from "@moj-bichard7/common/utils/userPermissions"
import { isEmpty } from "lodash"

import parseHearingOutcome from "../../services/parseHearingOutcome"
import { convertNoteRowToDto } from "./convertNoteRowToDto"
import { convertTriggerRowToDto } from "./convertTriggerRowToDto"
import { ResolutionStatus, resolutionStatusCodeByText, resolutionStatusFromDb } from "./resolutionStatusFromCaseDB"

export const convertCaseRowToCaseDto = (
  caseRow: PartialCaseRow,
  user: FullUserRow,
  logger: FastifyBaseLogger
): CaseDto => {
  const annotatedHearingOutcome = parseHearingOutcome(caseRow.annotated_msg, logger)
  const updatedHearingOutcome = caseRow.updated_msg && parseHearingOutcome(caseRow.updated_msg, logger)

  return {
    ...convertCaseRowToCasePartialDto(caseRow, user),
    aho: annotatedHearingOutcome as AnnotatedHearingOutcome,
    courtCode: caseRow.court_code,
    courtReference: caseRow.court_reference,
    orgForPoliceFilter: caseRow.org_for_police_filter,
    phase: caseRow.phase,
    updatedHearingOutcome: (updatedHearingOutcome as AnnotatedHearingOutcome) ?? caseRow.updated_msg
  } satisfies CaseDto
}

export const convertCaseRowToCasePartialDto = (caseRow: PartialCaseRow, user: FullUserRow): CasePartialDto => {
  return {
    asn: caseRow.asn,
    canUserEditExceptions:
      caseRow.error_locked_by_id === user?.username &&
      hasAccessToExceptions(user) &&
      caseRow.error_status === resolutionStatusCodeByText(ResolutionStatus.Unresolved),
    courtDate: caseRow.court_date,
    courtName: caseRow.court_name,
    defendantName: caseRow.defendant_name,
    errorId: caseRow.error_id,
    errorLockedByUserFullName: isEmpty(caseRow.error_locked_by_fullname?.replace(/ /g, ""))
      ? null
      : caseRow.error_locked_by_fullname,
    errorLockedByUsername: caseRow.error_locked_by_id,
    errorReport: caseRow.error_report,
    errorStatus: resolutionStatusFromDb(caseRow.error_status),
    isUrgent: caseRow.is_urgent,
    notes: caseRow.notes ? caseRow.notes.map(convertNoteRowToDto) : [],
    ptiurn: caseRow.ptiurn,
    resolutionTimestamp: caseRow.resolution_ts,
    triggerCount: caseRow.trigger_count,
    triggerLockedByUserFullName: isEmpty(caseRow.trigger_locked_by_fullname?.replace(/ /g, ""))
      ? null
      : caseRow.trigger_locked_by_fullname,
    triggerLockedByUsername: caseRow.trigger_locked_by_id,
    triggers: caseRow.triggers ? caseRow.triggers.map(convertTriggerRowToDto) : [],
    triggerStatus: resolutionStatusFromDb(caseRow.trigger_status)
  } satisfies CasePartialDto
}
