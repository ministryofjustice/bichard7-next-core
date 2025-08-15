import type { z } from "zod"

import type {
  ahoExceptionSchema,
  exceptionPathSchema,
  exceptionSchema,
  pncExceptionSchema
} from "@moj-bichard7/common/schemas/exception"

export type AhoException = z.infer<typeof ahoExceptionSchema>
export type ExceptionPath = z.infer<typeof exceptionPathSchema>
export type ExceptionResult<T> = { exceptions: Exception[]; value: T }
export type PncException = z.infer<typeof pncExceptionSchema>
type Exception = z.infer<typeof exceptionSchema>

export default Exception
