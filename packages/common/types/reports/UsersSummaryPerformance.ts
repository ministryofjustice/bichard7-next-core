import { z } from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"

export const UserSummaryPerformanceDtoSchema = z.object({
  exceptionsResolved: z.number(),
  fullName: z.string(),
  id: z.number(),
  totalNumberStillLocked: z.number(),
  triggerResolved: z.number(),
  username: z.string()
})

export const UsersSummaryPerformanceDtoSchema = z
  .object({
    date: dateLikeToDate,
    totals: z.object({
      exceptionsResolved: z.number(),
      totalNumberStillLocked: z.number(),
      triggerResolved: z.number()
    }),
    users: UserSummaryPerformanceDtoSchema.array()
  })
  .array()

export type UsersSummaryPerformanceDto = z.infer<typeof UsersSummaryPerformanceDtoSchema>
export type UserSummaryPerformanceDto = z.infer<typeof UserSummaryPerformanceDtoSchema>
