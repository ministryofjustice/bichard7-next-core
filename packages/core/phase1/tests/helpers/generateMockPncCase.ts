import type { PncCourtCase, PncOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

const createPNCCourtCase = (courtCaseReference: string, offences: PncOffence[] = []): PncCourtCase => ({
  courtCaseReference,
  offences
})

export default createPNCCourtCase
