import type { CaseDto, CaseIndexDto } from "@moj-bichard7/common/types/Case"
import type { Result } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { hasAccessToExceptions } from "@moj-bichard7/common/utils/userPermissions"
import { isEmpty, isError, sortBy } from "lodash"

import type { CaseRowForDto, CaseRowForIndexDto } from "../../types/Case"

import { convertNoteToDto } from "./convertNoteToDto"
import { ResolutionStatus, resolutionStatusCodeByText, resolutionStatusFromDb } from "./convertResolutionStatus"
import { convertTriggerRowToDto } from "./convertTriggerRowToDto"

export const convertCaseToCaseDto = (
  caseRowForDto: CaseRowForDto,
  user: User,
  logger: FastifyBaseLogger
): Result<CaseDto> => {
  const aho = parseHearingOutcome(caseRowForDto.annotated_msg, logger)
  if (isError(aho)) {
    return Error(`Failed to parse hearing outcome in convertCaseToCaseDto: ${aho.message}`)
  }

  const updatedAhoResult = caseRowForDto.updated_msg ? parseHearingOutcome(caseRowForDto.updated_msg, logger) : null
  if (isError(updatedAhoResult)) {
    return Error(`Failed to parse updated hearing outcome in convertCaseToCaseDto: ${updatedAhoResult.message}`)
  }

  return {
    ...convertCaseToCaseIndexDto(caseRowForDto, user),
    aho: JSON.parse(JSON.stringify(aho)),
    courtCode: caseRowForDto.court_code,
    courtReference: caseRowForDto.court_reference,
    orgForPoliceFilter: caseRowForDto.org_for_police_filter.trim(),
    phase: caseRowForDto.phase,
    updatedHearingOutcome: isEmpty(updatedAhoResult) ? null : JSON.parse(JSON.stringify(updatedAhoResult))
  }
}

export const convertCaseToCaseIndexDto = (
  caseRowForDto: CaseRowForDto | CaseRowForIndexDto,
  user: User
): CaseIndexDto => ({
  asn: caseRowForDto.asn,
  canUserEditExceptions:
    caseRowForDto.error_locked_by_id === user?.username &&
    hasAccessToExceptions(user) &&
    caseRowForDto.error_status === resolutionStatusCodeByText(ResolutionStatus.Unresolved),
  courtDate: caseRowForDto.court_date,
  courtName: caseRowForDto.court_name,
  defendantName: caseRowForDto.defendant_name,
  errorId: caseRowForDto.error_id,
  errorLockedByUserFullName: isEmpty(caseRowForDto.error_locked_by_fullname?.replace(/ /g, ""))
    ? null
    : caseRowForDto.error_locked_by_fullname,
  errorLockedByUsername: caseRowForDto.error_locked_by_id,
  errorQualityChecked: caseRowForDto.error_quality_checked,
  errorReport: caseRowForDto.error_report,
  errorStatus: resolutionStatusFromDb(caseRowForDto.error_status),
  isUrgent: caseRowForDto.is_urgent,
  messageReceivedAt: caseRowForDto.msg_received_ts,
  noteCount: (caseRowForDto as CaseRowForIndexDto).note_count
    ? Number((caseRowForDto as CaseRowForIndexDto).note_count)
    : undefined,
  notes: caseRowForDto.notes ? sortBy(caseRowForDto.notes, "create_ts").reverse().map(convertNoteToDto) : [],
  ptiurn: caseRowForDto.ptiurn,
  resolutionTimestamp: caseRowForDto.resolution_ts,
  triggerCount: caseRowForDto.trigger_count,
  triggerLockedByUserFullName: isEmpty(caseRowForDto.trigger_locked_by_fullname?.replace(/ /g, ""))
    ? null
    : caseRowForDto.trigger_locked_by_fullname,
  triggerLockedByUsername: caseRowForDto.trigger_locked_by_id,
  triggerQualityChecked: caseRowForDto.trigger_quality_checked,
  triggers: caseRowForDto.triggers ? caseRowForDto.triggers.map(convertTriggerRowToDto) : [],
  triggerStatus: resolutionStatusFromDb(caseRowForDto.trigger_status)
})
