import type DynamoGateway from "./DynamoGateway/DynamoGateway"
import type { ComparisonLog, PromiseResult } from "./Types"

const getFailedComparisonResults = (dynamoGateway: DynamoGateway): PromiseResult<ComparisonLog[]> =>
  dynamoGateway.getFailedOnes(10)

export default getFailedComparisonResults
