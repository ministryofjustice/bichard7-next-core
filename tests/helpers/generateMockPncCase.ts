import type { PncCourtCase, PncOffence } from "../../src/types/PncQueryResult"

const createPNCCourtCase = (courtCaseReference: string, offences: PncOffence[] = []): PncCourtCase => ({
  courtCaseReference,
  offences
})

export default createPNCCourtCase
