import type { Projection } from "./DynamoGateway"
import type KeyComparison from "./KeyComparison"
import type Pagination from "./Pagination"

export default interface FetchByIndexOptions {
  betweenKeyEnd?: unknown
  betweenKeyStart?: unknown
  filterKeyComparison?: KeyComparison
  filterKeyName?: string
  filterKeyValue?: unknown
  hashKeyName: string
  hashKeyValue: unknown
  indexName: string
  isAscendingOrder?: boolean
  pagination: Pagination
  projection?: Projection
  rangeKeyComparison?: KeyComparison
  rangeKeyName?: string
  rangeKeyValue?: unknown
}
