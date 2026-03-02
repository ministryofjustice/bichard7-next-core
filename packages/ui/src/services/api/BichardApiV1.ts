import type { UserList } from "@moj-bichard7/common/types/User"
import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"
import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { DisplayFullCourtCase } from "types/display/CourtCases"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import type ApiClient from "./ApiClient"
import { generateUrlSearchParams } from "services/api/utils/generateUrlSearchParams"
import type BichardApiGateway from "./interfaces/BichardApiGateway"
import type PromiseResult from "types/PromiseResult"

export default class BichardApiV1 implements BichardApiGateway {
  readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async fetchCase(caseId: number): Promise<DisplayFullCourtCase | Error> {
    return await this.apiClient.get<DisplayFullCourtCase>(V1.Case.replace(":caseId", `${caseId}`))
  }

  async fetchCases(apiCaseQuery: ApiCaseQuery): Promise<CaseIndexMetadata | Error> {
    return await this.apiClient.get<CaseIndexMetadata>(`${V1.Cases}?${generateUrlSearchParams(apiCaseQuery)}`)
  }

  async resubmitCase(caseId: number): Promise<Error> {
    return await this.apiClient.post(V1.CaseResubmit.replace(":caseId", `${caseId}`))
  }

  async saveAuditResults(
    caseId: number,
    auditResults: { triggerQuality: number; errorQuality: number; note: string }
  ): PromiseResult<Error> {
    try {
      return await this.apiClient.post(V1.CaseAudit.replace(":caseId", `${caseId}`), auditResults)
    } catch (error) {
      return error as Error
    }
  }

  async fetchUsers(): Promise<UserList | Error> {
    return await this.apiClient.get<UserList>(V1.Users)
  }

  async fetchAuditById(auditId: number): PromiseResult<AuditWithProgressDto> {
    return await this.apiClient.get<AuditWithProgressDto>(V1.AuditById.replace(":auditId", String(auditId)))
  }

  async fetchAuditCases(auditId: number): PromiseResult<AuditCasesMetadata> {
    return await this.apiClient.get<AuditCasesMetadata>(V1.AuditCases.replace(":auditId", String(auditId)))
  }
}
