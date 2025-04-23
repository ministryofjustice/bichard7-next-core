import { Endpoints } from "./endpoints"
import { Versions } from "./versions"

export const VersionedEndpoints: Record<string, Record<string, string>> = {
  V1: {
    AuditLog: Versions.V1 + Endpoints.AuditLog,
    AuditLogEvents: Versions.V1 + Endpoints.AuditLogEvents,
    AuditLogs: Versions.V1 + Endpoints.AuditLogs,
    Case: Versions.V1 + Endpoints.Case,
    CaseResubmit: Versions.V1 + Endpoints.CaseResubmit,
    Cases: Versions.V1 + Endpoints.Cases,
    Health: Versions.V1 + Endpoints.Health,
    Me: Versions.V1 + Endpoints.Me
  }
}

export const V1 = VersionedEndpoints.V1
