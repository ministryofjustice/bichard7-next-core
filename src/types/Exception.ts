import { z } from "zod"
import { ExceptionCode } from "./ExceptionCode"

export const exceptionSchema = z.object({
  code: z.nativeEnum(ExceptionCode),
  path: z.array(z.number().or(z.string()))
})

export type Exception = z.infer<typeof exceptionSchema>

export default Exception
