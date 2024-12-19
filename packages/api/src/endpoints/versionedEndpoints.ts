import { Endpoints } from "./endpoints"
import { Versions } from "./versions"

export const VersionedEndpoints: Record<string, Record<string, string>> = {
  V1: {
    Case: Versions.V1 + Endpoints.Case,
    CaseResubmit: Versions.V1 + Endpoints.CaseResubmit,
    Health: Versions.V1 + Endpoints.Health,
    Me: Versions.V1 + Endpoints.Me
  }
}
