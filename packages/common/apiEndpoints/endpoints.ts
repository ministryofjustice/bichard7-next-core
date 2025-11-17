export const enum Endpoints {
  AuditLog = "/audit-logs/:correlationId",
  AuditLogEvents = "/audit-logs/:correlationId/events",
  AuditLogs = "/audit-logs",
  Case = "/cases/:caseId",
  CaseAudit = "/cases/:caseId/audit",
  CaseResubmit = "/cases/:caseId/resubmit",
  Cases = "/cases",
  CasesResubmit = "/cases/resubmit",
  Health = "/health",
  Me = "/me"
}
