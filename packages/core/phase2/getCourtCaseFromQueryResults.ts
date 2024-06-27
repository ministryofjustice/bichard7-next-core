import type { PncCourtCase, PncQueryResult } from "../types/PncQueryResult"

const getCourtCaseFromQueryResults = (
  courtCaseRef: string,
  PncQuery: PncQueryResult | undefined
): PncCourtCase | undefined => PncQuery?.courtCases?.find((x) => x.courtCaseReference === courtCaseRef)

export default getCourtCaseFromQueryResults
