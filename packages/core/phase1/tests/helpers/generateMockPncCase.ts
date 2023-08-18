import type { PncCourtCase, PncOffence } from "@moj-bichard7/common/pnc/PncQueryResult"

const createPNCCourtCase = (courtCaseReference: string, offences: PncOffence[] = []): PncCourtCase => ({
  courtCaseReference,
  offences
})

export default createPNCCourtCase
