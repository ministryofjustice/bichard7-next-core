/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
import { Endpoints } from "./endpoints"
import { Versions } from "./versions"

export const enum VersionedEndpoints {
  V1CaseResubmit = Versions.V1 + Endpoints.CaseResubmit,
  V1Health = Versions.V1 + Endpoints.Health,
  V1Me = Versions.V1 + Endpoints.Me,
  V2Me = Versions.V2 + Endpoints.Me
}
