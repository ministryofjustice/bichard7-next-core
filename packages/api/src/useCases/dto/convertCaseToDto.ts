import type { CaseDto, CaseIndexDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { FastifyBaseLogger } from "fastify"

import { hasAccessToExceptions } from "@moj-bichard7/common/utils/userPermissions"
import { isEmpty, sortBy } from "lodash"

import type { CaseDataForDto, CaseDataForIndexDto } from "../../types/Case"

import parseHearingOutcome from "../../services/parseHearingOutcome"
import { convertNoteToDto } from "./convertNoteToDto"
import { ResolutionStatus, resolutionStatusCodeByText, resolutionStatusFromDb } from "./convertResolutionStatus"
import { convertTriggerToDto } from "./convertTriggerToDto"

export const convertCaseToCaseDto = (
  caseDataForDto: CaseDataForDto,
  user: User,
  logger: FastifyBaseLogger
): CaseDto => {
  const aho = parseHearingOutcome(caseDataForDto.annotated_msg, logger) as AnnotatedHearingOutcome
  const updatedAhoResult = caseDataForDto.updated_msg && parseHearingOutcome(caseDataForDto.updated_msg, logger)

  return {
    ...convertCaseToCaseIndexDto(caseDataForDto, user),
    aho,
    courtCode: caseDataForDto.court_code,
    courtReference: caseDataForDto.court_reference,
    orgForPoliceFilter: caseDataForDto.org_for_police_filter,
    phase: caseDataForDto.phase,
    updatedHearingOutcome: isEmpty(updatedAhoResult) ? null : (updatedAhoResult as AnnotatedHearingOutcome)
  } satisfies CaseDto
}

export const convertCaseToCaseIndexDto = (
  caseDataForDto: CaseDataForDto | CaseDataForIndexDto,
  user: User
): CaseIndexDto => {
  return {
    asn: caseDataForDto.asn,
    canUserEditExceptions:
      caseDataForDto.error_locked_by_id === user?.username &&
      hasAccessToExceptions(user) &&
      caseDataForDto.error_status === resolutionStatusCodeByText(ResolutionStatus.Unresolved),
    courtDate: caseDataForDto.court_date,
    courtName: caseDataForDto.court_name,
    defendantName: caseDataForDto.defendant_name,
    errorId: caseDataForDto.error_id,
    errorLockedByUserFullName: isEmpty(caseDataForDto.error_locked_by_fullname?.replace(/ /g, ""))
      ? null
      : caseDataForDto.error_locked_by_fullname,
    errorLockedByUsername: caseDataForDto.error_locked_by_id,
    errorReport: caseDataForDto.error_report,
    errorStatus: resolutionStatusFromDb(caseDataForDto.error_status),
    isUrgent: caseDataForDto.is_urgent,
    noteCount: (caseDataForDto as CaseDataForIndexDto).note_count
      ? Number((caseDataForDto as CaseDataForIndexDto).note_count)
      : undefined,
    notes: caseDataForDto.notes ? sortBy(caseDataForDto.notes, "create_ts").reverse().map(convertNoteToDto) : [],
    ptiurn: caseDataForDto.ptiurn,
    resolutionTimestamp: caseDataForDto.resolution_ts,
    triggerCount: caseDataForDto.trigger_count,
    triggerLockedByUserFullName: isEmpty(caseDataForDto.trigger_locked_by_fullname?.replace(/ /g, ""))
      ? null
      : caseDataForDto.trigger_locked_by_fullname,
    triggerLockedByUsername: caseDataForDto.trigger_locked_by_id,
    triggers: caseDataForDto.triggers ? caseDataForDto.triggers.map(convertTriggerToDto) : [],
    triggerStatus: resolutionStatusFromDb(caseDataForDto.trigger_status)
  } satisfies CaseIndexDto
}
