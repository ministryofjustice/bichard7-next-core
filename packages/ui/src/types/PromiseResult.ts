import { Result } from "./Result"

type PromiseResult<T> = Promise<Result<T>>

export default PromiseResult
