import type { Result } from "../types/Result"

type PromiseResult<T> = Promise<Result<T>>

export default PromiseResult
