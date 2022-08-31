import type DynamoGateway from "../DynamoGateway/DynamoGateway"
import type { ComparisonLog, PromiseResult } from "../types"

const getFailedComparisonResults = (dynamoGateway: DynamoGateway, limit: number): PromiseResult<ComparisonLog[]> =>
  dynamoGateway.getFailedOnes(limit)

export default getFailedComparisonResults
