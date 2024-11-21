import type { z } from "zod"

import type { ahoExceptionSchema, exceptionPathSchema, exceptionSchema, pncExceptionSchema } from "../schemas/exception"

export type ExceptionPath = z.infer<typeof exceptionPathSchema>
type Exception = z.infer<typeof exceptionSchema>
export type PncException = z.infer<typeof pncExceptionSchema>
export type AhoException = z.infer<typeof ahoExceptionSchema>
export type ExceptionResult<T> = { exceptions: Exception[]; value: T }

export default Exception
