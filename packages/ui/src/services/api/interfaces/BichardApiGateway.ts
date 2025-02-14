import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type FakeApiClient from "../../../../test/helpers/api/fakeApiClient"

export default interface BichardApiGateway {
  readonly apiClient: FakeApiClient

  fetchCase: (caseId: number) => Promise<DisplayFullCourtCase | Error>
}
