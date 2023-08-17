import type { PncCourtCase, PncQueryResult } from "common/pnc/PncQueryResult"

const createPNCMessage = (courtCases: PncCourtCase[]): PncQueryResult => ({ courtCases }) as PncQueryResult

export default createPNCMessage
