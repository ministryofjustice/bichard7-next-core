import { Endpoints } from "./endpoints"
import { Versions } from "./versions"

export const VersionedEndpoints: Record<string, Record<string, string>> = {
  V1: {
    Audit: Versions.V1 + Endpoints.Audit,
    AuditLog: Versions.V1 + Endpoints.AuditLog,
    AuditLogEvents: Versions.V1 + Endpoints.AuditLogEvents,
    AuditLogs: Versions.V1 + Endpoints.AuditLogs,
    Case: Versions.V1 + Endpoints.Case,
    CaseAudit: Versions.V1 + Endpoints.CaseAudit,
    CaseResubmit: Versions.V1 + Endpoints.CaseResubmit,
    Cases: Versions.V1 + Endpoints.Cases,
    CasesReportsBails: Versions.V1 + Endpoints.CasesReportsBails,
    CasesReportsDomesticViolence: Versions.V1 + Endpoints.CasesReportsDomesticViolence,
    CasesReportsExceptions: Versions.V1 + Endpoints.CasesReportsExceptions,
    CasesReportsWarrants: Versions.V1 + Endpoints.CasesReportsWarrants,
    CasesResubmit: Versions.V1 + Endpoints.CasesResubmit,
    Health: Versions.V1 + Endpoints.Health,
    Me: Versions.V1 + Endpoints.Me,
    Users: Versions.V1 + Endpoints.Users
  } as const
} as const

export const V1 = VersionedEndpoints.V1
