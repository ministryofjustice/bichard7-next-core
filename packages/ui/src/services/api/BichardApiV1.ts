import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type ApiClient from "./ApiClient"
import type BichardApiGateway from "./interfaces/BichardApiGateway"

export default class BichardApiV1 implements BichardApiGateway {
  readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async fetchCase(caseId: number): Promise<DisplayFullCourtCase | Error> {
    return await this.apiClient.get<DisplayFullCourtCase>(V1.Case.replace(":caseId", `${caseId}`))
  }

  async fetchCases(apiCaseQuery: ApiCaseQuery): Promise<CaseIndexMetadata | Error> {
    const urlSearchParams = new URLSearchParams()

    Object.entries(apiCaseQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, String(v)))
      } else {
        urlSearchParams.append(key, String(value))
      }
    })

    return await this.apiClient.get<CaseIndexMetadata>(`${V1.Cases}?${urlSearchParams.toString()}`)
  }
}
