import type { UserList } from "@moj-bichard7/common/types/User"
import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import { type AuditCasesMetadata, AuditCasesMetadataSchema } from "@moj-bichard7/common/types/AuditCase"
import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { DisplayFullCourtCase } from "types/display/CourtCases"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import type ApiClient from "./ApiClient"
import { generateUrlSearchParams } from "services/api/utils/generateUrlSearchParams"
import type BichardApiGateway from "./interfaces/BichardApiGateway"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

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

  async fetchAuditCases(auditId: number, auditCasesQuery: AuditCasesQuery): PromiseResult<AuditCasesMetadata> {
    const urlParams = new URLSearchParams()
    urlParams.set("order", auditCasesQuery.order)
    if (auditCasesQuery.orderBy) {
      urlParams.set("orderBy", auditCasesQuery.orderBy)
    }

    if (auditCasesQuery.pageNum) {
      urlParams.set("pageNum", String(auditCasesQuery.pageNum))
    }

    if (auditCasesQuery.maxPerPage) {
      urlParams.set("maxPerPage", String(auditCasesQuery.maxPerPage))
    }

    const result = await this.apiClient.get(
      `${V1.AuditCases.replace(":auditId", String(auditId))}?${urlParams.toString()}`
    )
    if (isError(result)) {
      return result
    }

    const parsedResult = AuditCasesMetadataSchema.safeParse(result)
    if (!parsedResult.success) {
      return parsedResult.error
    }

    return parsedResult.data
  }
}
