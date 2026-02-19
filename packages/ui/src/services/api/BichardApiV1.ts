import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type ApiClient from "./ApiClient"
import { generateUrlSearchParams } from "./generateUrlSearchParams"
import type BichardApiGateway from "./interfaces/BichardApiGateway"
import type PromiseResult from "types/PromiseResult"
import type { UserList } from "@moj-bichard7/common/types/User"

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
}
