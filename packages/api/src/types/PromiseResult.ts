import type { Result } from "src/types/Result"

type PromiseResult<T> = Promise<Result<T>>

export default PromiseResult
