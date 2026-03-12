import type { AuditCase, AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"

import { convertNoteToDto } from "./convertNoteToDto"
import { resolutionStatusFromDb } from "./convertResolutionStatus"

export const convertAuditCaseToDto = (auditCase: AuditCase): AuditCaseDto => ({
  asn: auditCase.asn,
  courtDate: auditCase.court_date,
  courtName: auditCase.court_name,
  courtReference: auditCase.court_reference,
  defendantName: auditCase.defendant_name,
  errorId: auditCase.error_id,
  errorQualityChecked: auditCase.error_quality_checked,
  errorStatus: resolutionStatusFromDb(auditCase.error_status),
  messageReceivedTimestamp: auditCase.msg_received_ts,
  noteCount: auditCase.notes?.length,
  notes: auditCase.notes ? auditCase.notes.map(convertNoteToDto) : [],
  ptiurn: auditCase.ptiurn,
  resolutionTimestamp: auditCase.resolution_ts,
  triggerQualityChecked: auditCase.trigger_quality_checked,
  triggerStatus: resolutionStatusFromDb(auditCase.trigger_status)
})
