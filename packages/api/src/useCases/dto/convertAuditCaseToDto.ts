import type { AuditCase, AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"

import { sortBy } from "lodash"

import { convertNoteToDto } from "./convertNoteToDto"
import { resolutionStatusFromDb } from "./convertResolutionStatus"

export const convertAuditCaseToDto = (auditCase: AuditCase): AuditCaseDto => ({
  asn: auditCase.asn,
  courtDate: auditCase.court_date,
  courtName: auditCase.court_name,
  defendantName: auditCase.defendant_name,
  errorId: auditCase.error_id,
  errorQualityChecked: auditCase.error_quality_checked,
  messageReceivedTimestamp: auditCase.msg_received_ts,
  noteCount: auditCase.notes?.length,
  notes: auditCase.notes ? sortBy(auditCase.notes, "create_ts").reverse().map(convertNoteToDto) : [],
  ptiurn: auditCase.ptiurn,
  resolutionTimestamp: auditCase.resolution_ts,
  triggerQualityChecked: auditCase.trigger_quality_checked,
  triggerStatus: resolutionStatusFromDb(auditCase.trigger_status)
})
