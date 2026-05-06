import { z } from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"

export const UserForPerformanceSummaryDtoSchema = z.object({
  exceptionsResolved: z.number(),
  fullName: z.string(),
  id: z.number(),
  totalNumberStillLocked: z.number(),
  triggerResolved: z.number(),
  username: z.string()
})

export const UserSummaryPerformanceDtoSchema = z
  .object({
    date: dateLikeToDate,
    totals: z.object({
      exceptionsResolved: z.number(),
      totalNumberStillLocked: z.number(),
      triggerResolved: z.number()
    }),
    users: UserForPerformanceSummaryDtoSchema.array()
  })
  .array()

export type UserForPerformanceSummaryDto = z.infer<typeof UserForPerformanceSummaryDtoSchema>
export type UserPerformanceSummaryDto = z.infer<typeof UserSummaryPerformanceDtoSchema>
