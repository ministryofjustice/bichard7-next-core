import type { RemandHeadline } from "./ArrestSummariesResponse"
import type { DisposalEntry } from "./DisposalHistoryResponse"

type CaseData = {
  disposals: DisposalEntry[]
  remands: RemandHeadline[]
}

export default CaseData
