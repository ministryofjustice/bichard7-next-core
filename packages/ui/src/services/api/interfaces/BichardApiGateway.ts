import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"
import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { UserList } from "@moj-bichard7/common/types/User"
import type ApiClient from "../ApiClient"
import type { DisplayFullCourtCase } from "types/display/CourtCases"

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
  fetchAuditById: (auditId: number) => PromiseResult<AuditWithProgressDto>
  fetchAuditCases: (auditId: number, auditCasesQuery: AuditCasesQuery) => PromiseResult<AuditCasesMetadata>
}
