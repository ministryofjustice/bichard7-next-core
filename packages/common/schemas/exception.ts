import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { z } from "zod"

export const exceptionPathSchema = z.array(z.number().or(z.string()))

export const ahoExceptionSchema = z.object({
  code: z.enum(ExceptionCode),
  path: exceptionPathSchema
})

export const pncExceptionSchema = z.object({
  code: z.enum(ExceptionCode),
  message: z.string(),
  path: exceptionPathSchema
})

export const exceptionSchema = z.union([pncExceptionSchema, ahoExceptionSchema])
