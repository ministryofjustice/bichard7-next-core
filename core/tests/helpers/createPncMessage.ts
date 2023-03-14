import type { PncCourtCase, PncQueryResult } from "../../src/types/PncQueryResult"

const createPNCMessage = (courtCases: PncCourtCase[]): PncQueryResult => ({ courtCases } as PncQueryResult)

export default createPNCMessage
