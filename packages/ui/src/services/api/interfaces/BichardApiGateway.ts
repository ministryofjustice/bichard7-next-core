import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type ApiClient from "../ApiClient"
import type { UserList } from "@moj-bichard7/common/types/User"

export default interface BichardApiGateway {
  readonly apiClient: ApiClient

  fetchCase: (caseId: number) => Promise<DisplayFullCourtCase | Error>
  fetchCases: (apiCaseQuerystring: ApiCaseQuery) => Promise<CaseIndexMetadata | Error>
  resubmitCase: (caseId: number) => Promise<Error>
  saveAuditResults: (
    caseId: number,
    auditResults: { triggerQuality: number; errorQuality: number; note: string }
  ) => Promise<Error>
  fetchUsers: () => Promise<UserList | Error>
}
