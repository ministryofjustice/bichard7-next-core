import type { PncCase, PncOffence } from "src/types/PncQueryResult"

const createPNCCourtCase = (courtCaseReference: string, offences: PncOffence[] = []): PncCase => ({
  courtCaseReference,
  offences
})

export default createPNCCourtCase
