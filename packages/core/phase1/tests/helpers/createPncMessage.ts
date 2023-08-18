import type { PncCourtCase, PncQueryResult } from "@moj-bichard7/common/pnc/PncQueryResult"

const createPNCMessage = (courtCases: PncCourtCase[]): PncQueryResult => ({ courtCases }) as PncQueryResult

export default createPNCMessage
