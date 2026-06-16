import type { AllocationBody } from "@moj-bichard7/common/contracts/AllocationBody"
import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { ApiConnectivityDto } from "@moj-bichard7/common/types/ApiConnectivity"
import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { UserList } from "@moj-bichard7/common/types/User"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type ApiClient from "../ApiClient"

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
  connectivity: (apiKey: string) => PromiseResult<ApiConnectivityDto>
  updateAllocation: (caseId: number, query: AllocationBody) => Promise<Error>
}
