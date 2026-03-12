import type { DisposalEntry } from "./DisposalHistoryResponse"
import type { RemandDetails } from "./RemandResponse"

type CaseData = {
  disposals: DisposalEntry[]
  remands: RemandDetails[]
}

export default CaseData
