import { z } from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"

export const CodeDetailUserDtoSchema = z.object({
  fullName: z.string(),
  id: z.number(),
  resolved: z.number(),
  totalLocked: z.number(),
  username: z.string()
})

export const CodeDetailDtoSchema = z.object({
  code: z.string(),
  description: z.string(),
  totals: z.object({
    resolved: z.number(),
    totalLocked: z.number()
  }),
  type: z.literal("exception").or(z.literal("trigger")),
  users: CodeDetailUserDtoSchema.array()
})

export const UserPerformanceDetailDtoSchema = z.object({
  codeDetails: CodeDetailDtoSchema.array(),
  date: dateLikeToDate,
  exceptions: CodeDetailDtoSchema.array(),
  triggers: CodeDetailDtoSchema.array()
})

export type CodeDetailDto = z.infer<typeof CodeDetailDtoSchema>
export type CodeDetailUserDto = z.infer<typeof CodeDetailUserDtoSchema>
export type UserPerformanceDetailDto = z.infer<typeof UserPerformanceDetailDtoSchema>
