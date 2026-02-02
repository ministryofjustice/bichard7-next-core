import type { AuditDto, AuditRow } from "@moj-bichard7/common/types/Audit"

export const convertAuditToDto = (auditRow: AuditRow): AuditDto => {
  return {
    auditId: auditRow.audit_id,
    completedWhen: auditRow.completed_when,
    createdBy: auditRow.created_by,
    createdWhen: auditRow.created_when,
    fromDate: auditRow.from_date,
    includedTypes: auditRow.included_types,
    resolvedByUsers: auditRow.resolved_by_users,
    toDate: auditRow.to_date,
    triggerTypes: auditRow.trigger_types,
    volumeOfCases: auditRow.volume_of_cases
  }
}
