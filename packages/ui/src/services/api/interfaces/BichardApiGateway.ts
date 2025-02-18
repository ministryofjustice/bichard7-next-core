import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type ApiClient from "../ApiClient"

export default interface BichardApiGateway {
  readonly apiClient: ApiClient

  fetchCase: (caseId: number) => Promise<DisplayFullCourtCase>
}
