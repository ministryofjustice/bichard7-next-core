import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"

import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type BichardApiGateway from "./interfaces/BichardApiGateway"
import type HttpClient from "./interfaces/HttpClient"

export default class BichardApiV1 implements BichardApiGateway {
  readonly apiClient: HttpClient

  constructor(apiClient: HttpClient) {
    this.apiClient = apiClient
  }

  async fetchCase(caseId: number): Promise<DisplayFullCourtCase | Error> {
    const result = await this.apiClient.get<DisplayFullCourtCase>(V1.Case.replace(":caseId", `${caseId}`))

    if (isError(result)) {
      return result
    }

    return result
  }
}
