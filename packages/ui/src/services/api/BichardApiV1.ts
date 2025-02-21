import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

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
}
