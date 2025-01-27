import type { Projection } from "./DynamoGateway"
import type Pagination from "./Pagination"

export default interface GetManyOptions {
  pagination: Pagination
  projection?: Projection
  sortKey: string
}
