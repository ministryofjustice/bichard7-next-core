import { Endpoints } from "./endpoints"
import { Versions } from "./versions"

// We can't use enum as we get `Explicit enum value must only be a literal value (string, number, boolean, etc)`.
// We can turn off the eslint rule locally, but we still get the issue on SonarCloud.
// That's why we use a hash/record over enum which would be our preferred solution.

export const VersionedEndpoints: Record<string, Record<string, string>> = {
  V1: {
    CaseResubmit: Versions.V1 + Endpoints.CaseResubmit,
    Health: Versions.V1 + Endpoints.Health,
    Me: Versions.V1 + Endpoints.Me
  }
}
