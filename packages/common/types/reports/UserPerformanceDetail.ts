import { z } from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"

export const CodeDetailDtoSchema = z.object({
  code: z.string(),
  description: z.string(),
  totals: z.object({
    resolved: z.number(),
    totalLocked: z.number()
  }),
  users: z
    .object({
      fullName: z.string(),
      id: z.number(),
      resolved: z.number(),
      totalLocked: z.number(),
      username: z.string()
    })
    .array()
})

export const UserPerformanceDetailDtoSchema = z.object({
  date: dateLikeToDate,
  exceptions: CodeDetailDtoSchema.array(),
  triggers: CodeDetailDtoSchema.array()
})

export type CodeDetailDto = z.infer<typeof CodeDetailDtoSchema>
export type UserPerformanceDetailDto = z.infer<typeof UserPerformanceDetailDtoSchema>
