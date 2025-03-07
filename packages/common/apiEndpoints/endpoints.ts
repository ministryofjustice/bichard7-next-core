export const enum Endpoints {
  AuditLog = "/audit-logs/:correlationId",
  AuditLogEvents = "/audit-logs/:correlationId/events",
  AuditLogs = "/audit-logs",
  Case = "/cases/:caseId",
  CaseResubmit = "/cases/:caseId/resubmit",
  Cases = "/cases",
  Health = "/health",
  Me = "/me"
}
