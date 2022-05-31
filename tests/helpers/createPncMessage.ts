import type { PncCase, PncQueryResult } from "src/types/PncQueryResult"

const createPNCMessage = (cases: PncCase[]): PncQueryResult => ({ cases } as PncQueryResult)

export default createPNCMessage
