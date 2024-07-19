import { z } from "zod"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

export const exceptionPathSchema = z.array(z.number().or(z.string()))

export const exceptionSchema = z.object({
  code: z.nativeEnum(ExceptionCode),
  path: exceptionPathSchema
})
