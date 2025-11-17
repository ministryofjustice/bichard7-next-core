import type { PoliceCourtCase, PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

const createPNCCourtCase = (courtCaseReference: string, offences: PoliceOffence[] = []): PoliceCourtCase => ({
  courtCaseReference,
  offences
})

export default createPNCCourtCase
