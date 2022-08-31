import type { ComparisonLog, PromiseResult } from "../types"
import type DynamoGateway from "./DynamoGateway"

const getFailedComparisonResults = (dynamoGateway: DynamoGateway, limit: number): PromiseResult<ComparisonLog[]> =>
  dynamoGateway.getFailedOnes(limit)

export default getFailedComparisonResults
